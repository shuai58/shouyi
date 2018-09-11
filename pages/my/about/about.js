var config = require('../../../utils/config.js'); 
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
 		
  },
  onLoad: function(res) {
  	wx.setNavigationBarTitle({
			  title:"关于我们"
			})
  	var that = this;
  	config.requstGet(config.getAbout,{},function (res) {
  		console.log(res)
			if (res.data.code==0) {
				var content = res.data.data.content;
			  content = content.replace('<img', '<img style="max-width:100%;height:auto" ')
				about: WxParse.wxParse('about', 'html', content, that,0)
			}
  	})
  } 
})

