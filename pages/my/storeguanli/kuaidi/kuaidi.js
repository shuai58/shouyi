var config = require('../../../../utils/config.js'); 
var app = getApp();
var kid="";
Page({
  data: {
 
  },
  onLoad: function (res) {
  	wx.setNavigationBarTitle({
		  title:"快递价格管理"
		})
  	var that = this;
  	kid="";
  	config.requstGet(config.getCourier,{shop_id:app.globalData.shop_id},function (res) {
  	 	console.log(res.data.data)
  	 	if (res.data.code==0) {
  	 		kid = res.data.data.id;
  	 		that.setData({
					c_price:res.data.data.c_price,
					rules:res.data.data.rules
				});
  	 	} 
  	})
  },
  savePersonInfo: function(e) {
		var that = this;
		var data = e.detail.value;
		console.log(data)
		if (kid=="") {
			config.requstPost(config.putCourier,{shop_id:app.globalData.shop_id,c_price:data.c_price,rules:data.rules},function (res) {
	  	 	console.log(res.data)
	  	 	if (res.data.code==0) {
	  	 		wx.showToast({
						title: '设置成功',
						icon: 'success',
						duration: 2000
					})
					setTimeout(function() {
						wx.navigateBack();
					}, 2000);
	  	 	} 
	  	})
		} else{
			config.requstPost(config.editCourier,{id:kid,c_price:data.c_price,rules:data.rules},function (res) {
	  	 	console.log(res.data)
	  	 	if (res.data.code==0) {
	  	 		wx.showToast({
						title: '设置成功',
						icon: 'success',
						duration: 2000
					})
					setTimeout(function() {
						wx.navigateBack();
					}, 2000);
	  	 	}else if(res.data.code==1) {
	  	 		wx.showToast({
						title: '设置失败！',
						icon: 'none',
						duration: 2000
					})
	  	 	}else if(res.data.code==2) {
	  	 		wx.showToast({
						title: '你未修改内容！',
						icon: 'none',
						duration: 2000
					})
	  	 	}
	  	})
		}
			
	}
})

