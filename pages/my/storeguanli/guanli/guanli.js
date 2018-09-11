var config = require('../../../../utils/config.js'); 
var app = getApp();
var shangjia = [];
var xiajia = [];
Page({
	data: {
	    isselect: true
	},
	onShow: function() {
		wx.setNavigationBarTitle({
		  title:"商品管理"
		})
		shangjia = [];
		xiajia = [];
		var that = this;
		config.requstGet(config.getShopGoods,{uid:app.globalData.uid,state:0},function (res) {
	   		console.log(res.data)
	   		if(res.data.code==0){
		   		shangjia = res.data.data;
		   		for (var i=0;i<shangjia.length;i++) {
		   			shangjia[i].images=config.baseUrl+shangjia[i].images;
		   		}
		   		that.setData({
					shangjia: shangjia
				})
		   	}
		}) 
	},
	isselect: function() {
		var that = this;
		if(this.data.isselect == true) {
			this.setData({
				isselect: false
			})
			config.requstGet(config.getShopGoods,{uid:app.globalData.uid,state:1},function (res) {
		   		console.log(res.data.data)
		   		if(res.data.code==0){
		   			xiajia = res.data.data;
			   		for (var i=0;i<xiajia.length;i++) {
			   			xiajia[i].images=config.baseUrl+xiajia[i].images;
			   		}
			   		that.setData({
						xiajia: xiajia
					})
		   		}	
			}) 
		} else {
			this.setData({
				isselect: true
			})
			config.requstGet(config.getShopGoods,{uid:app.globalData.uid,state:0},function (res) {
		   		console.log(res.data.data)
		   		if(res.data.code==0){
			   		shangjia = res.data.data;
			   		for (var i=0;i<shangjia.length;i++) {
			   			shangjia[i].images=config.baseUrl+shangjia[i].images;
			   		}
			   		that.setData({
						shangjia: shangjia
					})
			   	}
			}) 
		}
	},
	bianji:function (e) {
		console.log(e.currentTarget.dataset.id);
		wx.navigateTo({
			url: `/pages/my/storeguanli/upgoods/upgoods?goodsid=`+e.currentTarget.dataset.id
		})
	},
	xiajia:function (e) {
		var that = this;
		console.log(e.currentTarget.dataset.id)
		config.requstGet(config.putAway,{gid:e.currentTarget.dataset.id,state:1},function (res) {
	   		console.log(res.data)
	   		if (res.data.msg=="success") {
	   			wx.showToast({
				  title: '下架成功',
				  icon: 'success',
				  duration: 2000
				})
	   			for (var i=0;i<shangjia.length;i++) {
		   			if (shangjia[i].id==e.currentTarget.dataset.id) {
		   				shangjia.splice(i,1);
		   			} 
		   		}
	   			that.setData({
					shangjia: shangjia
				})
	   		} 
		}) 
	},
	shangjia:function (e) {
		var that = this;
		console.log(e.currentTarget.dataset.id)
		config.requstGet(config.putAway,{gid:e.currentTarget.dataset.id,state:0},function (res) {
	   		console.log(res.data)
	   		if (res.data.msg=="success") {
	   			wx.showToast({
				  title: '上架成功',
				  icon: 'success',
				  duration: 2000
				})
	   			for (var i=0;i<xiajia.length;i++) {
		   			if (xiajia[i].id==e.currentTarget.dataset.id) {
		   				xiajia.splice(i,1);
		   			} 
		   		}
	   			that.setData({
					xiajia: xiajia
				})
	   		} 
		}) 
	},
	del:function (e) {
		var that = this;
		console.log(e.currentTarget.dataset.id)
		wx.showModal({
		  title: '提示',
		  content: '是否确定删除！',
		  success: function(res) {
		    if (res.confirm) {
		    	config.requstGet(config.putDel,{gid:e.currentTarget.dataset.id},function (res) {
			   		console.log(res.data)
			   		if (res.data.msg=="success") {
			   			wx.showToast({
						  title: '删除成功',
						  icon: 'success',
						  duration: 2000
						})
			   			for (var i=0;i<xiajia.length;i++) {
				   			if (xiajia[i].id==e.currentTarget.dataset.id) {
				   				xiajia.splice(i,1);
				   			} 
				   		}
			   			that.setData({
							xiajia: xiajia
						})
			   		}  
				}) 
		    } else if (res.cancel) {
		      console.log('用户点击取消')
		    }
		  }
		})
			
	}
})