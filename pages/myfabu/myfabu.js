const config = require('../../utils/config.js');
var app = getApp();
var pagenum=0;
var circleList = [];
var cid = '';
var oid = '';
var rules = [];
var rulesid = '';
Page({
  data: {
  	isdisplay:0,
  	index:0,
  	iszhiding:0
  },
  onReady: function() {
    rules = [];
  	var that = this;
  	config.requstGet(config.getRules,{}, function(res) {
			console.log(res.data)
			if (res.data.code==0) {
				rules = res.data.data;
				that.setData({
					day:res.data.data,
					morey:rules[0].price
				})
				rulesid = rules[0].id
			}
		})
  },
  onLoad: function () {
  	wx.setNavigationBarTitle({
			  title:"我的发布"
			})
 		pagenum=0;
		circleList = [];
		wx.showLoading({
		  title: '数据加载中',
		})
		var that = this;
		config.requstGet(config.myissue,{uid:app.globalData.uid,p:pagenum},function (res) {
   			wx.hideLoading();
   			console.log(res.data.data)
   			if (res.data.code==0) {
   				circleList = res.data.data;
					for (var i=0; i<circleList.length;i++) {
						if(circleList[i].image!=null){
							for (var j=0; j<circleList[i].image.length;j++) {
								circleList[i].image[j] = config.baseUrl+circleList[i].image[j];
							}
						}
						var timedata =(Math.floor(new Date().getTime()/1000)-Math.floor(circleList[i].reftime));
						if(Math.floor(timedata/(3600*24))>0){
							circleList[i].reftime = Math.floor(timedata/(3600*24))+"天前"
						}else if(Math.floor(timedata/3600)>0){
							circleList[i].reftime = Math.floor(timedata/3600)+"小时前"
						}else if(Math.floor(timedata/60)>0){
							circleList[i].reftime = Math.floor(timedata/60)+"分钟前"; 
						}else{
							if (Math.floor(timedata)<=0) {
								circleList[i].reftime = 1+"秒前"; 
							} else{
								circleList[i].reftime = Math.floor(timedata)+"秒前"; 
							}
						}
					}
					console.log(circleList)
					that.setData({
						circleList:circleList
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
	  config.requstGet(config.myissue,{uid:app.globalData.uid,p:pagenum},function (res) {
   			wx.hideLoading();
   			console.log(res.data.data)
   			if (res.data.code==0) {
   				var circleList2 = res.data.data;
					for (var i=0; i<circleList2.length;i++) {
						if(circleList2[i].image!=null){
							for (var j=0; j<circleList2[i].image.length;j++) {
								circleList2[i].image[j] = config.baseUrl+circleList2[i].image[j];
							}
						}
						var timedata =(Math.floor(new Date().getTime()/1000)-Math.floor(circleList2[i].reftime));
						if(Math.floor(timedata/(3600*24))>0){
							circleList2[i].reftime = parseInt(timedata/(3600*24))+"天前"
						}else if(Math.floor(timedata/3600)>0){
							circleList2[i].reftime = Math.floor(timedata/3600)+"小时前"
						}else if(Math.ceil(timedata/60>0)){
							circleList2[i].reftime = Math.ceil(timedata/60)+"分钟前"; 
						}else{
							circleList2[i].reftime = Math.ceil(timedata)+"秒前"; 
						}
						circleList.push(circleList2[i])
					}
					that.setData({
						circleList:circleList
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
	onPullDownRefresh: function(){
		console.log("加载了")
    wx.stopPullDownRefresh();
    this.onLoad();
  },
	fabu: function(e) {
 		wx.navigateTo({
			url: "/pages/quan/fabu/fabu" 
		})
	},
	delbtn: function(e) {
		var that = this;
		wx.showModal({
		  title: '友情提示',
		  content: '你确定要删除！',
		  success: function(res) {
		    if (res.confirm) {
		    	wx.showLoading({
					  title: '删除中！',
					});
		      config.requstGet(config.delete,{uid:app.globalData.uid,cid:e.currentTarget.dataset.cid}, function(res) {
						console.log(res.data)
						if (res.data.code==0) {
							wx.showToast({
							  title: '删除成功！',
							  icon: 'success',
							  duration: 2000
							})
							for (var i=0; i<circleList.length;i++) {
								if (circleList[i].id==e.currentTarget.dataset.cid) {
									circleList.splice(i,1);
									break;
								} 
							}
							that.setData({
								circleList:circleList
							})
						}else{
							wx.showModal({
							  title: '删除失败',
							  content: '请从新删除！',
							  showCancel:false,
							  success: function(res) {
							  }
							})
						}
					})
		    } 
		  }
		})		
	},
	refebtn: function(e) {
 		config.requstGet(config.refresh,{uid:app.globalData.uid,cid:e.currentTarget.dataset.cid}, function(res) {
			console.log(res.data)
			if (res.data.code==0) {
				wx.showToast({
				  title: '刷新成功！',
				  icon: 'success',
				  duration: 2000
				})
			}else{
				wx.showModal({
				  title: '刷新失败',
				  content: res.data.data,
				  showCancel:false,
				  success: function(res) {
				  }
				})
			}
		})
	},
	zhiding: function(e) {
		var that = this;
		that.setData({
			iszhiding:1
		})
		cid = e.currentTarget.dataset.cid;
		console.log(e.currentTarget.dataset.cid)
		console.log(rulesid)
	},
	quxiao:function(e) {
		var that = this;
		that.setData({
			iszhiding:0
		})
	},
	queding:function(e) {
		var that = this;
		console.log(cid)
		console.log(rulesid) 
		config.requstPost(config.createOrder,{uid:app.globalData.uid,cid:cid,rid:rulesid}, function(res) {
			console.log(res.data)
			if (res.data.code==0) {
				wx.requestPayment({
				  'timeStamp':res.data.data.timeStamp, 
				  'nonceStr': res.data.data.nonceStr,
				  'package': res.data.data.package,
				  'signType':res.data.data.signType,
				  'paySign': res.data.data.paySign,
				  'success':function(res){
				   		console.log("支付成功！")
				   		wx.showToast({
							  title: '支付成功',
							  icon: 'success',
							  duration: 2000,
							  success: function(res) {
							  	that.setData({
										iszhiding:0
									})
						  	}
							}) 
				  },
				  'fail':function(res){
				  	wx.showToast({
						  title: '支付失败，请从新支付！',
						  icon: 'none',
						  duration: 2000 
					  }) 
				  }
				})
			}else{
				wx.showModal({
				  title: '置顶失败',
				  content: res.data.data,
				  showCancel:false,
				  success: function(res) {
				  }
				})
			}
		})
	},
	praisebtn: function(e) {
		var that = this;
		console.log(e.currentTarget.dataset)
		console.log(e.currentTarget.dataset.ispraise)
 		if (e.currentTarget.dataset.ispraise==0) {
 			config.requstGet(config.circleLike,{uid:app.globalData.uid,cid:e.currentTarget.dataset.cid,type:1}, function(res) {
				console.log(res.data)
				if (res.data.code==0) {
					for (var i=0; i<circleList.length;i++) {
 						if (circleList[i].id==e.currentTarget.dataset.cid) {
 							circleList[i].isPraise=1;
 							circleList[i].praise = circleList[i].praise+1;
 						} 
					}
					that.setData({
						circleList:circleList
					})
				}
			})
 		} else{
 			config.requstGet(config.circleLike,{uid:app.globalData.uid,cid:e.currentTarget.dataset.cid,type:2}, function(res) {
				console.log(res.data)
				if (res.data.code==0) {
					for (var i=0; i<circleList.length;i++) {
 						if (circleList[i].id==e.currentTarget.dataset.cid) {
 							circleList[i].isPraise=0;
 							circleList[i].praise = circleList[i].praise-1;
 						} 
					}
					that.setData({
						circleList:circleList
					})
				}
			})
 		}
	},
	pinglun: function(e) {
 		var that = this;
		console.log(e.currentTarget.dataset)
		cid = e.currentTarget.dataset.cid;
		oid = e.currentTarget.dataset.oid;
		that.setData({
			isdisplay:1
		})
	},
	close: function(e) {
 		var that = this;
		that.setData({
			isdisplay:0
		})
	},
	sendbtn: function(e) {
 		var that = this;
		var data = e.detail.value;
		data.uid = app.globalData.uid; 
		data.cid = cid;
		data.oid = oid
		console.log(data)
		if(trim(data.content)=='') {
			wx.showToast({
			  title: '请输入评价内容！',
			  icon: 'none',
			  duration: 2000
			})
		}else{
			wx.showLoading({
			  title: '正在评论！',
			});
			config.requstPost(config.reply,data, function(res) {
				console.log(res.data)
				wx.hideLoading();
				if (res.data.code==0) {
					for (var i=0; i<circleList.length;i++) {
 						if (circleList[i].id==data.cid) {
 							circleList[i].replynum = circleList[i].replynum+1;
 							var pushdata={};
 							console.log(app.globalData.userInfo.nickName)
 							if (app.globalData.userInfo.nickName==undefined) {
 								pushdata.uname = '您的评论';
 							} else{
 								pushdata.uname = app.globalData.userInfo.nickName;
 							}
 							pushdata.content = data.content;
 							circleList[i].reply.push(pushdata)
 							break;
 						} 
					}
					that.setData({
						circleList:circleList,
						isdisplay:0
					})
					wx.showToast({
					  title: '评论成功！',
					  icon: 'none',
					  duration: 2000
					})
				}
			})
		}
	},
	imgYu:function(e){
		console.log(e.currentTarget.dataset.yu)
		var src = e.currentTarget.dataset.src;//获取data-src
		console.log(src)
		//图片预览
		wx.previewImage({
			current: src,
			urls: e.currentTarget.dataset.yu // 需要预览的图片http链接列表
		})
	},
	bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      morey:rules[e.detail.value].price
    })
    rulesid = rules[e.detail.value].id
  },
})

function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
} 