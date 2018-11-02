const config = require('../../utils/config.js');
var app = getApp();
var pagenum=0;
var circleList = [];
var cid = '';
var oid = '';
Page({
  data: {
  	 isdisplay:0
  },
  onLoad: function () {
  	wx.setNavigationBarTitle({
		  title:"手艺圈"
		})
		pagenum=0;
		circleList = [];
		wx.showLoading({
		  title: '数据加载中',
		})
		var that = this;
		config.requstGet(config.circleList,{uid:app.globalData.uid,p:pagenum},function (res) {
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
	  config.requstGet(config.circleList,{uid:app.globalData.uid,p:pagenum},function (res) {
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
							circleList2[i].reftime = Math.floor(timedata/(3600*24))+"天前"
						}else if(Math.floor(timedata/3600)>0){
							circleList2[i].reftime = Math.floor(timedata/3600)+"小时前"
						}else if(Math.floor(timedata/60)>0){
							circleList2[i].reftime = Math.floor(timedata/60)+"分钟前"; 
						}else{
							if (Math.floor(timedata)<=0) {
								circleList2[i].reftime = 1+"秒前"; 
							} else{
								circleList2[i].reftime = Math.floor(timedata)+"秒前"; 
							}
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
		if (app.globalData.shenfen==0) {
  		var url = '/pages/shouquan/shouquan?url='+"/pages/quan/quan";
  		wx.navigateTo({
			  url: url
			})
  	} else{
			if (app.globalData.level==1||app.globalData.level==3) {
				wx.navigateTo({
					url: "/pages/quan/fabu/fabu" 
				})
			} else{
				wx.showModal({
				  title: '友情提示',
				  content: '只有手艺人才能发布消息！',
				  confirmText:'入住手艺',
				  success: function(res) {
				    if (res.confirm) {
				      wx.navigateTo({
								url: `/pages/shouyi/shouyi`
							})
				    } 
				  }
				})
			}
		}
	},
	call: function(e) {
		var total_fee = 0;
		var ski_id = e.currentTarget.dataset.uid;
		config.requstGet(config.lookIphone,{uid:app.globalData.uid,ski_id:ski_id},function (res) {
			if (res.data.code==0) {
				wx.makePhoneCall({
				  phoneNumber:res.data.data.tel
				})	
			} else{
				if (res.data.data.price!=undefined) {
          console.log(res.data.data)
          total_fee = res.data.data.price;
          wx.showModal({
					  title: '友情提示',
					  content: '需要先支付查看电话费用,才能拨打电话！',
					  success: function(res) {
					  	if (res.cancel) {
	               //点击取消,默认隐藏弹框
	            } else {
	               //点击确定	              
	              config.requstPost(config.examine,{uid:app.globalData.uid,ski_id:ski_id,total_fee:total_fee}, function(res) {
									console.log(res.data)
									if (res.data.state==1) {
										var oid = res.data.id;
										wx.requestPayment({
										  'timeStamp':res.data.timeStamp, 
										  'nonceStr': res.data.nonceStr,
										  'package': res.data.package,
										  'signType':res.data.signType,
										  'paySign': res.data.paySign,
										  'success':function(res){
										  	console.log(res)
										   		console.log("支付成功！")
													wx.showModal({
													  title: '支付成功!',
													  content: '已成功发布并置顶！',
													  showCancel:false,
													  success: function(res) {
				 											config.requstGet(config.examines,{uid:app.globalData.uid,oid:oid,state:1},function (res) {
				 												if (res.data.code==0) {
				 													console.log(res.data.data)
				 													wx.makePhoneCall({
																	  phoneNumber:res.data.data
																	})	
				 												}
				 											})
													  }
													})
										  },
										  'fail':function(res){
										  	console.log(res)
											  wx.showModal({
												  title: '支付失败!',
												  content: '支付失败！',
												  showCancel:false,
												  success: function(res) {
 														config.requstGet(config.examines,{uid:app.globalData.uid,oid:oid,state:1},function (res) {
 														})
												  }
												})
										  }
										})
									}
								}) 
	            }
					  }
					})
				} else{
					wx.showModal({
					  title: '支付异常!',
					  content: '请从新支付！',
					  showCancel:false,
					  success: function(res) {
					  }
					})
				}
				 
			}
		})
	 		
	},
	praisebtn: function(e) {
		var that = this;
		console.log(e.currentTarget.dataset)
		console.log(e.currentTarget.dataset.ispraise)
		if (app.globalData.shenfen==0) {
  		var url = '/pages/shouquan/shouquan?url='+"/pages/quan/quan";
  		wx.navigateTo({
			  url: url
			})
  	} else{
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
  	}
	 		
	},
	pinglun: function(e) {
 		var that = this;
		console.log(e.currentTarget.dataset)
		if (app.globalData.shenfen==0) {
  		var url = '/pages/shouquan/shouquan?url='+"/pages/quan/quan";
  		wx.navigateTo({
			  url: url
			})
  	} else{
			cid = e.currentTarget.dataset.cid;
			oid = e.currentTarget.dataset.oid;
			that.setData({
				isdisplay:1
			})
		}
	},
	close: function(e) {
 		var that = this;
		that.setData({
			isdisplay:0
		})
	},
	sendbtn: function(e) {
		console.log(e.detail.value)
 		var that = this;
		var data = {};
		data.uid = app.globalData.uid; 
		data.cid = cid;
		data.oid = oid;
		if (e.detail.value.content!=undefined) {
			data.content = e.detail.value.content;
		} else{
			data.content = e.detail.value;
		}
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
	}
})

function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
} 
