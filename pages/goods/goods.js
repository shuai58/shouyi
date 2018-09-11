const config = require('../../utils/config.js');
var app = getApp();
var pagenum=0;
var pllist = [];
var ggid="";
var goodsid;
Page({
	data: {
	    isselect: true,
	    showModalStatus: false,
	    animationData:"",
	    xuanzheclass:"请选择规格",
	    guigeimg:"",
	    pllist:[],
	    shopnum:1
	},
	onLoad: function(res) {
		wx.setNavigationBarTitle({
		  title:"商品详情"
		})
		pagenum=0;
		goodsid = res.id;
		pllist = [];
		ggid="";
		console.log(res)
		var that = this;
		if(res.id==undefined){
			wx.navigateBack();
		}else{
			wx.showLoading({
			  title: '加载中'
			});
			config.requstGet(config.getDetails,{gid:res.id},function (res) {
	   			console.log(res.data.data)
	   			wx.hideLoading();
	   			if(res.data.code==0){
	   				var goodsinfo = res.data.data;
		   			goodsinfo.images = config.baseUrl + goodsinfo.images;
		   			for (var i = 0; i < goodsinfo.banner.length; i++) {
						goodsinfo.banner[i] = config.baseUrl + goodsinfo.banner[i];
					}
		   			if(goodsinfo.details!=null){
		   				if(goodsinfo.details.images!=null&&goodsinfo.details.images!=undefined&&goodsinfo.details.images.length>0){
			   				for (var i = 0; i < goodsinfo.details.images.length; i++) {
								goodsinfo.details.images[i] = config.baseUrl + goodsinfo.details.images[i];
							}
			   			}
		   			}
		   			for (var i = 0; i < goodsinfo.rules.length; i++) {
		   				goodsinfo.rules[i].isselect=0;
						goodsinfo.rules[i].rule_image = config.baseUrl + goodsinfo.rules[i].rule_image;
					}
		   			that.setData({
						goods: goodsinfo,
						guigeimg:goodsinfo.images
					}) 
	   			}
		   			
		    }) 
		    config.requstGet(config.getGoodsReply,{gid:res.id,p:pagenum},function (res) {
	   			console.log(res.data.data)
 				if(res.data.code==0){
 					pllist = res.data.data;
 					for(var i=0; i < pllist.length; i++){
 						for(var j=0; j<pllist[i].image.length;j++){
 							pllist[i].image[j] = config.baseUrl + pllist[i].image[j];
 						}
   						pllist[i].addtime = format(pllist[i].addtime);
 					}
 					that.setData({
						pllist: pllist 
					}) 
 				}
		    })
		}
	},
	isselect: function() {
		if(this.data.isselect == true) {
			this.setData({
				isselect: false
			})
		} else {
			this.setData({
				isselect: true
			})
		}
	},
	alertShow: function(){
	  	this.setData({
	      alert1:false
	    })
	  	this.showModal()
	},
	showModal: function () {
	    // 显示遮罩层
	    var animation = wx.createAnimation({
	      duration: 200,
	      timingFunction: "linear",
	      delay: 0
	    })
	    this.animation = animation
	    animation.translateY(300).step()
	    this.setData({
	      animationData: animation.export(),
	      showModalStatus: true
	    })
	    setTimeout(function () {
	      animation.translateY(0).step()
	      this.setData({
	        animationData: animation.export()
	      })
	    }.bind(this), 200)
	},
	hideModal: function () {
	    // 隐藏遮罩层
	    var animation = wx.createAnimation({
	      duration: 200,
	      timingFunction: "linear",
	      delay: 0
	    })
	    this.animation = animation
	    animation.translateY(300).step()
	    this.setData({
	      animationData: animation.export(),
	      alert:true 
	    }) 
	    setTimeout(function () {
	      animation.translateY(0).step()
	      this.setData({
	        animationData: animation.export(),
	        showModalStatus: false
	      })
	    }.bind(this), 200)
	},
	shopclick: function () {
	    wx.navigateTo({
		  url: `/pages/goods/dingdanxq/dingdanxq` 
		})
	},
	guigeclick: function (e) {
	    console.log(e.currentTarget.dataset.id);
	    var that = this;
	    var goodsinfo = that.data.goods;
	    console.log(goodsinfo);
	    for (var i = 0; i < goodsinfo.rules.length; i++) {
	    	goodsinfo.rules[i].isselect=0;
			if(goodsinfo.rules[i].id==e.currentTarget.dataset.id){
				ggid = goodsinfo.rules[i].id;
				console.log("规格id"+ggid)
				goodsinfo.rules[i].isselect=1;
				that.setData({
					xuanzheclass:goodsinfo.rules[i].title,
	    			guigeimg:goodsinfo.rules[i].rule_image,
	    			price:'￥'+goodsinfo.rules[i].r_price
				}) 
			}
		}
	    that.setData({
			goods:goodsinfo
		}) 
	},
	imgYu:function(e){
		var src = e.currentTarget.dataset.src;//获取data-src
		console.log(e.currentTarget.dataset.yu)
		//图片预览
		wx.previewImage({
			current: src,
			urls: e.currentTarget.dataset.yu // 需要预览的图片http链接列表
		})
	},
	telclick: function() {
		wx.makePhoneCall({
		  phoneNumber: this.data.goods.iphone
		})
	},
	backindex: function() {
		wx.switchTab({
		  url: `/pages/index/index`
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
	addCount() {
		var that = this;
		var num = that.data.shopnum; 
		num++;
		that.setData({
			shopnum:num
		}) 
	},
	minusCount() {
		var that = this;
		var num = that.data.shopnum; 
		if (num<=1) {
			num==1;
		} else{
			num--;
		}
		that.setData({
			shopnum:num
		}) 
	     
	},
	addcar: function() {
		if (app.globalData.shenfen==0) {
  			var url = '/pages/shouquan/shouquan';
  			wx.navigateTo({
			  url: url
			})
  		} else{
			var that = this;
			console.log("规格id"+ggid)
			if(ggid==""){
				wx.showToast({
				  title: '请选择规格！',
				  icon: 'none',
				  duration: 2000
				})
				this.setData({
			      alert1:false
			    })
			  	this.showModal()
			}else{
				var goods = that.data.goods;
				var massage={
					goods_name:goods.name,// 商品名称
					rules_name:that.data.xuanzheclass,// 商品规格名称
					goods_price:that.data.price.split("￥")[1],// 商品单价
					num:that.data.shopnum,// 购买数量
					gid:goods.id,// 商品id
					rid:ggid,// 规格id
					uid:app.globalData.uid,// 用户id
					shop_id:goods.shop_id,
					image: that.data.guigeimg.split(config.baseUrl)[1]
				}
				console.log(massage)
				config.requstPost(config.putCart, massage, function(res) {
					console.log(res)
					if(res.data.code==0){
						wx.showToast({
						  title: '加入购物车成功！',
						  icon: 'none',
						  duration: 2000
						})
						that.hideModal();
					}else{
						wx.showToast({
						  title: '加入购物车失败，请从新添加！',
						  icon: 'none',
						  duration: 2000
						})
					}
				})
			}
		}
	},
	goshop: function() {
		if (app.globalData.shenfen==0) {
  			var url = '/pages/shouquan/shouquan';
  			wx.navigateTo({
			  url: url
			})
  		} else{
			var that = this;
			console.log("规格id"+ggid)
			if(ggid==""){
				wx.showToast({
				  title: '请选择规格！',
				  icon: 'none',
				  duration: 2000
				})
				this.setData({
			      alert1:false
			    })
			  	this.showModal()
			}else{
				var goods = that.data.goods;
				console.log(goods)
				var massage={
					shop_id:goods.shop_id,
					shop_name:goods.shop_name, 
					shop_img:goods.shop_img,
					gid:goods.id,// 商品id
					rid:ggid,// 规格id
					s_name:goods.name,// 商品名称
					image: that.data.guigeimg.split(config.baseUrl)[1],
					unit_price:that.data.price.split("￥")[1],// 商品单价
					num:that.data.shopnum,// 购买数量
					rules_name:that.data.xuanzheclass,// 商品规格名称
				}
				console.log(massage)
				console.log(that.data.xuanzheclass)
				var datalist = {
		  			shop_id:massage.shop_id,
					shop_name:massage.shop_name,
					shop_img:massage.shop_img,
					group:[
						{
							gid:massage.gid,
							rid:massage.rid,
							s_name:massage.s_name,
							image:massage.image,
							unit_price:massage.unit_price,
							num:massage.num,
							rule_name:massage.rules_name
						}
					]
			  	}
				console.log(datalist)
				datalist ="["+JSON.stringify(datalist)+"]"; 
				wx.navigateTo({
					url: `/pages/goods/dingdanxq/dingdanxq?urldata=${datalist}` 
				})
			}
		}
	},
	onReachBottom:function (e) {
		if(this.data.isselect == false&&pllist.length>0) {
			console.log("该加载了！")
			pagenum++;
			wx.showLoading({
			  title: '加载中',
			});
			config.requstGet(config.getGoodsReply,{gid:goodsid,p:pagenum},function (res) {
				wx.hideLoading();
	   			console.log(res.data.data)
	   			if (res.data.code==1) {
	   				pagenum--;
	   				wx.showToast({
					  title: '没有更多数据了！',
					  icon: 'none',
					  duration: 2000
					})
	   			} else{
	   				for(var i=0; i < res.data.data.length; i++){
						for(var j=0; j<res.data.data[i].image.length;j++){
							res.data.data[i].image[j] = config.baseUrl + res.data.data[i].image[j];
						}
						res.data.data[i].addtime = format(res.data.data[i].addtime);
						pllist.push(res.data.data[i]);
					}
					that.setData({
						pllist: pllist 
					}) 
	   			}	
		   })
		} 
	},
	onShareAppMessage: function () {
		var that = this;
		var title = this.data.goods.name;
	    return {
	      title: '发现手艺',
	      desc: title,
	      path: '/pages/goods/goods?id=' + goodsid
	    }
	},
})
function format(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D;
}