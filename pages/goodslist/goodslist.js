const config = require('../../utils/config.js');
var app = getApp();
var pagenum=0;
var shoplist = [];
var cid = '';
var type;
var keyword='';
var start='';
var end='';
Page({
	data: {
		isshaixuan:0 
	},
	onLoad: function(res) {
		wx.showLoading({
		  title: '数据加载中',
		})
		pagenum=0;
		shoplist = [];
		keyword='';
		start='';
		end='';
		var that = this;
		if (res.type == 0) {
			cid = res.id;
			type = 0;
			config.requstGet(config.getGoods,{cid:res.id,p:pagenum,start:start,end:end},function (res) {
				wx.hideLoading();
	   			console.log(res.data.data)
	   			if (res.data.code==0) {
	   				shoplist = res.data.data;
					for (var i = 0; i < shoplist.length; i++) {
						shoplist[i].images = config.baseUrl+shoplist[i].images;
					}
					that.setData({
						shoplist:shoplist
					})
	   			}else{
	   				that.setData({
						shoplist:[]
					})
	   			}
		    })
		} else{
			type =1;
			console.log(res.type)
			console.log(res.keyword)
			keyword = res.keyword;
			that.setData({
				keyword:keyword
			})
			config.requstGet(config.seekGoods,{keyword:keyword,p:pagenum,start:start,end:end},function (res) {
				wx.hideLoading();
	   			console.log(res.data.data)
	   			if (res.data.code==0) {
	   				shoplist = res.data.data;
					for (var i = 0; i < shoplist.length; i++) {
						shoplist[i].images = config.baseUrl+shoplist[i].images;
					}
					that.setData({
						shoplist:shoplist
					})
	   			}else{
	   				that.setData({
						shoplist:[]
					})
	   			}
		    })
		}
			 	
	},
	shaixuan: function () {
		if (this.data.isshaixuan==0) {
			this.setData({
				isshaixuan: 1
			})
		} else{
			this.setData({
				isshaixuan: 0
			})
		}
    },
    getkeyword: function(e) {
		console.log(e.detail.value)
		keyword = e.detail.value;
	},
	goodslist: function() {
		console.log(keyword)
		wx.showLoading({
		  title: '数据加载中',
		})
		pagenum=0;
		shoplist = [];
		start='';
		end='';
		var that = this;
 		type =1;
		config.requstGet(config.seekGoods,{keyword:keyword,p:pagenum},function (res) {
			wx.hideLoading();
   			console.log(res.data.data)
   			if (res.data.code==0) {
   				shoplist = res.data.data;
				for (var i = 0; i < shoplist.length; i++) {
					shoplist[i].images = config.baseUrl+shoplist[i].images;
				}
				that.setData({
					shoplist:shoplist
				})
   			}else{
   				that.setData({
					shoplist:[]
				})
   			}
	    })
	},
	startv:function(e) {
		start = e.detail.value;
	},
	endv:function(e) {
		end = e.detail.value;
	},
	quxiao:function(e) {
		var that = this;
		this.setData({
			isshaixuan: 0
		})
	},
	queding:function() {
		var that = this;
		this.setData({
			isshaixuan: 0
		})
		pagenum=0;
		shoplist = [];
		console.log("type:"+type)
		if (type==1) {
			console.log("keyword:"+keyword)
			config.requstGet(config.seekGoods,{keyword:keyword,start:start,end:end,p:pagenum},function (res) {
				wx.hideLoading();
	   			console.log(res.data.data)
	   			if (res.data.code==0) {
	   				shoplist = res.data.data;
					for (var i = 0; i < shoplist.length; i++) {
						shoplist[i].images = config.baseUrl+shoplist[i].images;
					}
					that.setData({
						shoplist:shoplist
					})
	   			}else{
	   				that.setData({
						shoplist:[]
					})
	   			}
		    })
		}else{
			console.log("cid:"+cid)
			config.requstGet(config.getGoods,{cid:cid,start:start,end:end,p:pagenum},function (res) {
				wx.hideLoading();
	   			console.log(res.data.data)
	   			if (res.data.code==0) {
	   				shoplist = res.data.data;
					for (var i = 0; i < shoplist.length; i++) {
						shoplist[i].images = config.baseUrl+shoplist[i].images;
					}
					that.setData({
						shoplist:shoplist
					})
	   			}else{
	   				that.setData({
						shoplist:[]
					})
	   			}
		    })
		}
		
	},
	onReachBottom:function (e) {
		var that = this;
 		wx.showLoading({
		  title: '加载中',
		});
		pagenum++;
		if (type == 0) {
			config.requstGet(config.getGoods,{cid:cid,p:pagenum,start:start,end:end},function (res) {
	   			console.log(res.data.data)
	   			wx.hideLoading();
	   			if (res.data.code==0) {
	   				var shoplist2 = res.data.data;
					for (var i = 0; i < shoplist2.length; i++) {
						shoplist2[i].images = config.baseUrl+shoplist2[i].images;
						shoplist.push(shoplist2[i])
					}
					that.setData({
						shoplist:shoplist
					})
	   			}else{
	   				pagenum--;
	   				wx.showToast({
					  title: '没有更多数据了！',
					  icon: 'none',
					  duration: 2000
					})
	   			}
		    })
		} else{
			type =1;
			config.requstGet(config.seekGoods,{keyword:keyword,p:pagenum,start:start,end:end},function (res) {
				console.log(res.data.data)
	   			wx.hideLoading();
	   			if (res.data.code==0) {
	   				var shoplist2 = res.data.data;
					for (var i = 0; i < shoplist2.length; i++) {
						shoplist2[i].images = config.baseUrl+shoplist2[i].images;
						shoplist.push(shoplist2[i])
					}
					that.setData({
						shoplist:shoplist
					})
	   			}else{
	   				pagenum--;
	   				wx.showToast({
					  title: '没有更多数据了！',
					  icon: 'none',
					  duration: 2000
					})
	   			}
		    })
		}
			
	},
	goodsxq: function(e) {
		wx.navigateTo({
		  url: `/pages/goods/goods?id=`+e.currentTarget.dataset.id
		})
	},
	addcar: function(e) {
		if (app.globalData.shenfen==0) {
  			var url = '/pages/shouquan/shouquan';
  			wx.navigateTo({
			  url: url
			})
  		} else{
			var gid = e.currentTarget.dataset.gid;
			console.log(gid)
			config.requstGet(config.putCartDefault,{id:gid,uid:app.globalData.uid},function (res) {
	   			console.log(res.data.data)
	   			if (res.data.code==0) {
	   				wx.showToast({
					  title: '加入购物车成功',
					  icon: 'success',
					  duration: 2000
					})
	   			}else{
	   				wx.showToast({
					  title: '加入购物车失败',
					  icon: 'success',
					  duration: 2000
					})
	   			}
		    })
		}
	}
}) 