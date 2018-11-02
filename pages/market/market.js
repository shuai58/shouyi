const config = require('../../utils/config.js');
var app = getApp();
var navlist = [];
var classdata = [];
var pagenum=0;
var shoplist = [];
var one_id = '';
var keyword='';
var pid=null;
Page({
	data: {
		navbox: 1,
		navbox2: 0,
		back: 0,
		banner:[],
		hbshow:0,
		isshare:0,
		isfx:1
	},
	onLoad: function(res) {
		var that = this;
		pid=null;
		console.log(res)
		if(res!=undefined&&res.pid!=undefined){
			pid = res.pid;
			that.setData({
				hbshow:1
			})
	  	}else{
	  		config.requstGet(config.getSplit,{uid:app.globalData.uid},function (res) {
	   			console.log(res.data)
	   			if (res.data.code==0) {
	   				var is_packet = res.data.data.is_packet;
	   				console.log(is_packet)
	   				if (is_packet==0) {
	   					that.setData({
							hbshow:1
						})
	   				} else{
	   					that.setData({
							hbshow:0
						})
	   				}
	   			}else if (res.data.code==2) {
	   				var headimg = res.data.img;
	   				for(var i = 0; i < 3; i++) {
	   					if (headimg[i]==undefined) {
	   						headimg[i]='';
	   					} 
	   				}
	   				console.log(headimg)
	   				that.setData({
						isshare:1,
						isfx:1,
						headimg:headimg,
						tishi:"还差"+res.data.data+"人，即可瓜分"+res.data.money+"元红包，快邀请好友来拆吧！" 
					})
	   			} 
		    }) 	
	  	}
		wx.setNavigationBarTitle({
		  title:"手艺集市"
		})
		navlist = [];
		classdata = [];
		pagenum=0;
		shoplist = [];
		one_id = '';
		keyword='';
		wx.showLoading({
		  title: '数据加载中',
		})
		config.requstGet(config.goodsClass,{},function (res) {
   			console.log(res.data.data)
   			for (var i = 0; i < res.data.data.length; i++) {
   				if (i<7) {
   					res.data.data[i].ison = 0;
   					navlist.push(res.data.data[i])
   				}
   				classdata.push(res.data.data[i]) 	
   			}
			that.setData({
				navitem: navlist,
				classdata:classdata
			}); 
			console.log(that.data.navitem)
	    }) 
	    config.requstGet(config.getBanner,{},function (res) {
   			console.log(res.data.data)
   			if (res.data.code==0) {
   				var banner = res.data.data;
				for (var i = 0; i < banner.length; i++) {
					banner[i].image = config.baseUrl+banner[i].image;
				}
				that.setData({
					banner:banner
				})
				console.log(banner)
   			} 	
	    })
	    config.requstGet(config.getOgoods,{one_id:one_id,p:pagenum},function (res) {
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
   			} 	
	    }) 	
	},
	morenav: function() {
		this.setData({
			navbox: 0,
			navbox2: 1,
			back: 1
		})
	},
	back: function() {
		this.setData({
			navbox: 1,
			navbox2: 0,
			back: 0
		})
	},
	onReachBottom:function (e) {
		var that = this;
 		wx.showLoading({
		  title: '加载中',
		});
		pagenum++;
		config.requstGet(config.getOgoods,{one_id:one_id,p:pagenum},function (res) {
   			console.log(res.data.data)
   			wx.hideLoading();
   			if (res.data.code==0) {
   				var shopdata = res.data.data;
				for (var i = 0; i < shopdata.length; i++) {
					shopdata[i].images = config.baseUrl+shopdata[i].images;
					shoplist.push(shopdata[i]);
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
	},
	goodsxq: function(e) {
		wx.navigateTo({
		  url: `/pages/goods/goods?id=`+e.currentTarget.dataset.id
		})
	},
	getkeyword: function(e) {
		console.log(e.detail.value)
		keyword = e.detail.value;
	},
	goodslist: function() {
		console.log(keyword)
		if (keyword=="") {
			wx.showToast({
			  title: '请输入搜索关键字！',
			  icon: 'none',
			  duration: 2000
			})
		} else{
			wx.navigateTo({
			  url: `/pages/goodslist/goodslist?type=1&&keyword=`+keyword
			})
		}
			
	},
	navclick: function(e){
		var that = this;
		console.log(e.currentTarget.dataset.id)
		for (var i = 0; i < navlist.length; i++) {
			navlist[i].ison = 0;
			if(navlist[i].id==e.currentTarget.dataset.id){
				navlist[i].ison = 1;
			}
		}
		that.setData({
			navitem: navlist
		})
		if (one_id!=e.currentTarget.dataset.id) {
			pagenum=0;
			one_id = e.currentTarget.dataset.id;
			config.requstGet(config.getOgoods,{one_id:one_id,p:pagenum},function (res) {
	   			console.log(res.data.data)
	   			if (res.data.code==0) {
	   				shoplist = res.data.data;
					for (var i = 0; i < shoplist.length; i++) {
						shoplist[i].images = config.baseUrl+shoplist[i].images;
					}
					shoplist=shoplist
	   			}else{
	   				shoplist=[]
	   			}
	   			that.setData({
					shoplist:shoplist
				})
		    }) 	
		} 
	},
	itemnav: function(e) {
		console.log(e.currentTarget.dataset.id)
		wx.navigateTo({
		  url: `/pages/goodslist/goodslist?type=0&&id=`+ e.currentTarget.dataset.id
		})
	},
	gocar: function() {
		if (app.globalData.shenfen==0) {
  			var url = '/pages/shouquan/shouquan?url='+"/pages/car/car";
  			wx.navigateTo({
			  url: url
			})
  		} else{
			wx.navigateTo({
			  url: `/pages/car/car`
			})
		}
	},
	onPullDownRefresh: function(){
		console.log("加载了")
	    wx.stopPullDownRefresh();
	    this.onLoad();
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
	hbclose:function () {
		this.setData({
			hbshow:0
		})
	},
	gethb:function () {
		var that = this;
		if(pid!=null){
			config.requstGet(config.putPoints,{uid:app.globalData.uid,pid:pid},function (res) {
	   			console.log(res.data.data)
	   			that.setData({
					hbshow:0
				})
	   			if (res.data.code==0) {
					var tishi = '领取红包成功，可在我的红包中查看！'
	   			}else if(res.data.code==1){
					var tishi = "你已拆开红包！还差一个人,即可平分"+res.data.money+"元红包！ "
		   		}else if(res.data.code==2){
					var tishi = "你已拆过红包！还差一个人,即可平分"+res.data.money+"元红包！ "
		   		}else if(res.data.code==3){
					var tishi = '红包已开启.你来晚了！';
	   			}
	   			var headimg = res.data.img;
   				for(var i = 0; i < 3; i++) {
   					if (headimg[i]==undefined) {
   						headimg[i]='';
   					} 
   				}
				that.setData({
					isshare:1,
					hbshow:0,
					headimg:headimg,
					tishi:tishi,
					isfx:0
				})
		    }) 	
		}else{
			config.requstGet(config.putGenerate,{uid:app.globalData.uid},function (res) {
	   			console.log(res.data.data)
	   			if (res.data.code==0) {
	   				var headimg = res.data.img;
	   				for(var i = 0; i < 3; i++) {
	   					if (headimg[i]==undefined) {
	   						headimg[i]='';
	   					} 
	   				}
   					that.setData({
						isshare:1,
						isfx:1,
						hbshow:0,
						headimg:headimg,
						tishi:"你已开启"+res.data.money+"元红包！分享朋友，需再分享2个人一起拆，才可获得！"
					})
	   			}  
		    }) 	 
		}
			
	},
	onShareAppMessage: function (res) {
		console.log(res)
		if (res.from === 'button') {
	    	// 来自页面内转发按钮
	    	console.log(res.target)
	    	return {
		      title: '手艺人',
		      desc: '有一个红包等你合力来拆！',
		      path: '/pages/market/market?pid=' + app.globalData.uid
		    }
	    }else{
	    	return {
		      title: '手艺人',
		      desc: '手艺市集',
		      path: '/pages/market/market'
		    }
	    }
		    
	},
	share:function(){
		this.setData({
			isshare:0
		})
		wx.showShareMenu({
		  withShareTicket: true
		})
	},
	quxiao:function(){
		console.log(12321)
		this.setData({
			isshare:0
		})
	} 
})