var config = require('../../../../utils/config.js'); 
var app = getApp();
var navlist=[];
var page = 0;
var postdata = {};
var index = 0; 
Page({
	data: {
		isselect: 0
	},
	onLoad: function(res) {
		var that = this;
		console.log(res)
		wx.setNavigationBarTitle({
		  title:"商家订单管理"
		})
 		wx.showLoading({
		  title: '数据加载中',
		})
 		if (res.index!=undefined) {
			index = res.index;
			that.isselect(index+"");
			return
		} 
		index = 0;
		that.setData({
			isselect: index
		}) 
		page = 0;
		console.log(navlist)
		postdata = {
			sid:app.globalData.shop_id,
			statu:4,
			p:page
		}
	  	that.getData();
	},
	isselect: function(e) {
		var that = this;
		page = 0;
		if(e.currentTarget!=undefined){
			index=e.currentTarget.dataset.id;
		}else{
			index=e;
		}
		switch (index){
			case '0':
				postdata = {
					sid:app.globalData.shop_id,
					statu:4,
					p:page
				}
			  	that.getData();
				break;
			case '1':
				postdata = {
					sid:app.globalData.shop_id,
					statu:1,
					delivery:0,
					p:page
				}
			  	that.getData();
				break;
			case '2':
				postdata = {
					sid:app.globalData.shop_id,
					statu:1,
					delivery:1,
					p:page
				}
			  	that.getData();
				break;
			case '3':
				postdata = {
					sid:app.globalData.shop_id,
					is_refund:1,
					p:page
				}
			  	that.getData();
				break;
			default:
				break;
		}
		this.setData({
			isselect: index
		})
	},
	onReachBottom:function (e) {
		var that = this;
 		wx.showLoading({
		  title: '加载中',
		});
		page++; 
		postdata.p=page
		config.requstGet(config.shopsOrder,postdata,function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data.data
				for (var i = 0; i < getdata.length; i++) {
					getdata[i].shop_img = config.baseUrl + getdata[i].shop_img;
					for (var j = 0; j < getdata[i].group.length; j++) {
						getdata[i].group[j].image = config.baseUrl + getdata[i].group[j].image;
					}
					navlist.push(getdata[i])
				} 
				that.setData({
					dingdan: navlist 
				}) 
			}else{
				page =page-1; 
				wx.showToast({
				  title: '没有更多数据了！',
				  icon: 'none',
				  duration: 2000
				})
			}
	    })
		console.log(navlist)
	},
	getData:function () {
		var that = this;
		navlist = [];
		config.requstGet(config.shopsOrder,postdata,function (res) {
	  		wx.hideLoading();
	  		console.log(res.data.data)
			if (res.data.code==0) {
				var getdata = res.data.data
				for (var i = 0; i < getdata.length; i++) {
					getdata[i].shop_img = config.baseUrl + getdata[i].shop_img;
					for (var j = 0; j < getdata[i].group.length; j++) {
						getdata[i].group[j].image = config.baseUrl + getdata[i].group[j].image;
					}
					navlist.push(getdata[i])
				} 
				that.setData({
					dingdan: navlist 
				}) 
			} 
	  	})
		that.setData({
			dingdan: navlist 
		}) 
	},
	urlnav:function (e) {
		console.log(e.currentTarget.dataset) 
		var data=e.currentTarget.dataset.url;
		data=data.split(',');
		console.log(data) 
		var urldata = {
			oid:data[0],
			out_trade_no:data[3],
			out_refund_no:data[4],
			price:data[1],
			real_price:data[2]
		}
		console.log(urldata) 
		urldata =JSON.stringify(urldata); 
		wx.navigateTo({
			url:`/pages/my/storeguanli/storedingdan/yuanyin/yuanyin?urldata=${urldata}`
		})	
	},
	del:function (e) {
		var oid = e.currentTarget.dataset.id;
		var that = this;
		wx.showModal({
		  title: '友情提示',
		  content: '你确定要删除订单记录！删除后你将无法撤回!',
		  success: function(res) {
		    if (res.confirm) {
		    	wx.showLoading({
				  title: '删除中！',
				});
		       config.requstGet(config.delOrderRecord,{id:oid,is_del:2},function (res) {
					console.log(res.data.data)
					wx.hideLoading();
					if (res.data.code==0) {
						wx.showToast({
						  title: '删除成功！',
						  icon: 'success',
						  duration: 2000
						}) 
						that.isselect(index+"");
					} 
			    })
		    } else if (res.cancel) {
		      console.log('用户点击取消')
		    }
		  }
		})
	},
	onPullDownRefresh: function(){
		console.log("加载了")
	    wx.stopPullDownRefresh();
	    this.isselect(index+"");
  	}
})

