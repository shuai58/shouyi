var config = require('../../../utils/config.js'); 
var app = getApp();
Page({
  data: {
 
  },
  onLoad: function (res) {
  	wx.setNavigationBarTitle({
			  title:"物流信息"
			})
  	console.log(res)
  	wx.showLoading({
		  title: '加载中'
		});
		var that = this;
  	config.requstGet(config.expInfo,res,function (res) {
			console.log(res.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data 
				for (var i = 0; i < getdata.data.data.length; i++) {
					getdata.data.data[i].time = getdata.data.data[i].time.split(" ");
				}
				that.setData({
					address:getdata.adder,
					wuliu: getdata.data.data
				}) 
			}else{
				wx.showToast({
				  title: '获取物流信息失败',
				  icon: 'none',
				  duration: 2000
				})
			}
	  })
  } 
})

