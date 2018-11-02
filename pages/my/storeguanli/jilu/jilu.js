var config = require('../../../../utils/config.js'); 
var app = getApp();
var pagenum=0;
var getdata = [];
Page({
  data: {
 
  },
  onLoad: function (res) {
  	wx.setNavigationBarTitle({
		  title:"提现记录"
		})
  	var that = this;
  	wx.showLoading({
		  title: '加载中',
		});
		pagenum=0;
		getdata = [];
		config.requstGet(config.moneyRecords,{shop_id:app.globalData.shop_id,p:pagenum},function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				getdata = res.data.data
				for (var i = 0; i < getdata.length; i++) {
					getdata[i].addtime = timestampToTime(getdata[i].addtime)
				}
 				that.setData({
					jilu:getdata 
				})
			} 
	  })
  },
  onReachBottom:function (e) {
		var that = this;
 		wx.showLoading({
		  title: '加载中',
		});
		pagenum++;
		config.requstGet(config.moneyRecords,{shop_id:app.globalData.shop_id,p:pagenum},function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata2 = res.data.data
				for (var i = 0; i < getdata2.length; i++) {
					getdata2[i].addtime = timestampToTime(getdata2[i].addtime)
					getdata.push(getdata2[i])
				}
 				that.setData({
					jilu:getdata 
				})
			}else {
				pagenum--;
				wx.showToast({
					title: '没有更多数据了！',
					icon: 'none',
					duration: 2000
				})
			} 
	  })
	}
})

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}