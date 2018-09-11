var config = require('../../../../utils/config.js'); 
var app = getApp();
var keyword=0;
Page({
  data: {
 
  },
  onLoad: function (res) {
  	wx.setNavigationBarTitle({
		  title:"我的资产"
		})
  	var that = this;
  	wx.showLoading({
		  title: '计算中',
		});
		keyword=0;
		that.setData({
			isshow:0
		})
		config.requstGet(config.getShop,{uid:app.globalData.uid},function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data.data
 				that.setData({
					real_price:getdata.balance
				})
			} 
	  })
  },
  tixian: function () {
  	var that = this;
  	if (keyword<=0) {
  		wx.showModal({
			  title: '友情提示',
			  content: "提现金额需大于零元",
			  showCancel:false,
			  success: function(res) {
			  }
			}) 
			return
  	}else if(parseFloat(keyword)>that.data.real_price){
  		console.log(keyword+"GV结婚GV结婚")
  		wx.showModal({
			  title: '友情提示',
			  content: "提现金额大于可提现金额！",
			  showCancel:false,
			  success: function(res) {
			  }
			}) 
			return
  	}
  	wx.showLoading({
		  title: '申请中！',
		});
  	config.requstGet(config.drawMoney,{uid:app.globalData.uid,shop_id:app.globalData.shop_id,applys:keyword},function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				wx.showModal({
				  title: '友情提示',
				  content: res.data.data,
				  showCancel:false,
				  success: function(res) {
				  	that.onLoad()
				  }
				}) 
			} 
	  })
  },
  getkeyword: function(e) {
		console.log(e.detail.value)
		keyword = e.detail.value;
	},
	show: function(e) {
		var that = this;
		if (that.data.real_price<=0) {
  		wx.showModal({
			  title: '友情提示',
			  content: "暂无可提现金额！",
			  showCancel:false,
			  success: function(res) {
			  }
			}) 
			return
  	}
		that.setData({
			isshow:1
		})
	},
	close: function(e) {
		var that = this;
		that.setData({
			isshow:0
		})
	}
})

