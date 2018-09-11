const config = require('../../../utils/config.js');
var app = getApp();
var pagenum=0;
var shoplist = [];
Page({
	data: {
		imgindex:0,
		scrollTop:0,
		type:{
			isintro:0,
			ishome:0,
			isstore:0
		},
		shoplist:[]
	},
	onLoad: function(res) {
		pagenum=0;
		console.log(res)
		var storeinfo = JSON.parse(res.urldata); 
		console.log(storeinfo)
//		storeinfo.image = storeinfo.image 
		for (var i = 0; i < storeinfo.image.length; i++) {
			storeinfo.image[i] = config.baseUrl + storeinfo.image[i];
		}
		var that = this;
		that.setData({
			storeinfo:storeinfo
		})
		if (res.type==1) {
			wx.setNavigationBarTitle({
			  title:"手艺之家"
			})
			that.setData({
				type:{
					isintro:0,
					ishome:1,
					isstore:0
				}
			})
		}else{
			if (storeinfo.is_shop==1) {
				config.requstGet(config.skiShop,{uid:storeinfo.uid,p:pagenum},function (res) {
		   			console.log(res.data.data.data)
					shoplist = res.data.data.data;
					for (var i = 0; i < shoplist.length; i++) {
						shoplist[i].images = config.baseUrl+shoplist[i].images;
					}
					that.setData({
						shoplist:shoplist
					})
			    }) 			
			} else{
				wx.showModal({
				  title: '友情提示',
				  content: '此手艺人还未开店！',
				  success: function(res) {
				    if (res.confirm) {
				      console.log('用户点击确定')
				    } else if (res.cancel) {
				      console.log('用户点击取消')
				    }
				  }
				})
			} 
			wx.setNavigationBarTitle({
			  title:"手艺商店"
			})
			that.setData({
				type:{
					isintro:0,
					ishome:0,
					isstore:1
				}
			})
		}
	},
	closeback: function() {
		wx.navigateBack(); 
	},
	isshow: function(e) {
//		console.log(e.currentTarget.dataset.type)
		var that = this;
		switch (e.currentTarget.dataset.type){
			case '0':
				if (that.data.type.isintro==0) {
					that.setData({
				 		scrollTop:0
				 	})
				} 
			 	that.setData({
			 		type:{
						isintro:1,
						ishome:0,
						isstore:0
					}
			 	})
				wx.setNavigationBarTitle({
				  title:"手艺介绍"
				})
				break;
			case '1':
				that.setData({
			 		type:{
						isintro:0,
						ishome:1,
						isstore:0
					}
			 	})
				wx.setNavigationBarTitle({
				  title:"手艺之家"
				})
				break;
			case '2':
				var that = this;
				var info = that.data.storeinfo;
				if (info.is_shop==1) {
					if(that.data.shoplist.length<=0) {
						config.requstGet(config.skiShop,{uid:info.uid,p:pagenum},function (res) {
				   			console.log(res.data.data.data)
							shoplist = res.data.data.data;
							for (var i = 0; i < shoplist.length; i++) {
								shoplist[i].images = config.baseUrl+shoplist[i].images;
							}
							that.setData({
								shoplist:shoplist
							})
					    }) 	
					} 
				} else{
					wx.showModal({
					  title: '友情提示',
					  content: '此手艺人还未开店！',
					  success: function(res) {
					    if (res.confirm) {
					      console.log('用户点击确定')
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
				}
				if (that.data.type.isstore==0) {
					that.setData({
				 		scrollTop:0
				 	})
				} 
				that.setData({
			 		type:{
						isintro:0,
						ishome:0,
						isstore:1
					}
			 	})
				wx.setNavigationBarTitle({
				  title:"手艺商店"
				})	
				break;
			default:
				break;
		}
	},
	telclick: function() {
		wx.makePhoneCall({
		  phoneNumber: this.data.storeinfo.tel 
		})
	},
	navigateclick: function() {
		var that = this;
		var info = that.data.storeinfo;
		var addre = info.adder.city+info.adder.county+info.title;
		wx.openLocation({
			latitude: Number(info.mark.lat),
			longitude: Number(info.mark.lon),
			scale: 14,
			name: info.title,
			address: addre
		})
	},
	lfbtn: function() {
		var that = this;
		var len = that.data.storeinfo.image.length-1;
		if (that.data.imgindex<len) {
			var index = that.data.imgindex +1;
		} else{
			var index = 0;
		}
		that.setData({
			imgindex:index
		})
	},
	rgbtn: function() {
		var that = this;
		var len = that.data.storeinfo.image.length-1;
		if (that.data.imgindex<=0) {
			var index = len;
		} else{
			var index = that.data.imgindex -1;
		}
		that.setData({
			imgindex:index
		})
	},
	current: function(e) {
 		console.log(e.detail)
 		var that = this;
		that.setData({
			imgindex:e.detail.current
		})
	},
	onbottom: function() {
 		var that = this;
 		wx.showLoading({
		  title: '加载中',
		});
		pagenum++;
		config.requstGet(config.skiShop,{uid:that.data.storeinfo.uid,p:pagenum},function (res) {
   			console.log(res.data.data.data)
   			wx.hideLoading();
   			if (res.data.data.data.length<=0) {
   				pagenum--;
   				wx.showToast({
				  title: '没有更多数据了！',
				  icon: 'none',
				  duration: 2000
				})
   			} else{
   				for (var i = 0; i < res.data.data.data.length; i++) {
					res.data.data.data[i].images = config.baseUrl+res.data.data.data[i].images;
					shoplist.push(res.data.data.data[i])
				}
				that.setData({
					shoplist:shoplist
				})
   			}	
	    }) 	
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
	},
	imgYu:function(e){
		var src = e.currentTarget.dataset.src;//获取data-src
		console.log(e.currentTarget.dataset.yu)
		//图片预览
		wx.previewImage({
			current: src,
			urls: e.currentTarget.dataset.yu // 需要预览的图片http链接列表
		})
	}
})