var config = require('../../../utils/config.js'); 
var app = getApp();
Page({
  data: {
 
  },
  onShow: function (res) {
  	wx.setNavigationBarTitle({
			  title:"我的红包"
			})
  	console.log(res)
  	wx.showLoading({
		  title: '加载中'
		});
		var that = this;
  	config.requstGet(config.getPacke,{uid:app.globalData.uid},function (res) {
			console.log(res.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data.data
				for (var i = 0; i<getdata.length;i++) {
					getdata[i].overtime=format(getdata[i].overtime)
   			}
				that.setData({
					packet:getdata,
				}) 
			}else{
				that.setData({
					packet:[]
				}) 
			}
	  })
  } 
})
function format(timestamp) {
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate();
	return Y+M+D 
}
