var config = require('../../utils/config.js'); 
var model = require('../../model/model.js');
var item = {};
const app = getApp();
var tempFilePaths1 = [];
var tempFilePaths2 = [];
var tempFilePaths3 = [];
var tempFilePaths4 = [];
var issy = 0;
var mylogo = [];
var mypic = [];
var isxieyi=0;
Page({
  data: {
		isshow1:1,
		isshow2:1,
		isxieyi:isxieyi
  },
  onShow: function (res) {
  	var that = this;
 		wx.setNavigationBarTitle({
		  title:"店铺资料"
		});
	},
	onReady: function(e) {
		var that = this;
		//请求数据
		model.updateAreaData(that, 0, e);
	},
  onLoad: function (res) {
  	item = {};
		tempFilePaths1 = [];
		tempFilePaths2 = [];
		tempFilePaths3 = [];
		tempFilePaths4 = [];
		issy = 0;
		isxieyi = 0;
		mylogo = [];
		mypic = [];
  	var that = this;
  	wx.getLocation({
		  type: 'wgs84',
		  success: function(res) {
		    console.log("授权成功！")
		    that.setData({
					isposition:1
				})
		  },
		  fail:function(res) {
		    console.log("授权失败！")
		    that.setData({
					isposition:0
				})
		  }
		})
		config.requstGet(config.getshopVerdict,{uid:app.globalData.uid}, function(res) {
			console.log(res.data)
			if (res.data.code==0) {
				if (res.data.data.states==0) {
					wx.showModal({
					  title: '友情提示',
					  content: '正在审核，请耐心等待！',
					  success: function(res) {
					    if (res.confirm) {
					      wx.navigateBack();
					    } else if (res.cancel) {
					      wx.navigateBack();
					    }
					  }
					})
				} else if (res.data.data.states==2){
					wx.showModal({
					  title: '友情提示',
					  content: '审核失败，请从新按规定填写信息！',
					  success: function(res) {
					    if (res.confirm) {
					      console.log('用户点击确定')
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
				} else if (res.data.data.states==1){
					wx.showLoading({
					  title: '数据加载中',
					})
					issy = 1;
					if (app.globalData.level==0) {
						app.globalData.level=2
					}else if(app.globalData.level==1){
						app.globalData.level=3
					}
					config.requstGet(config.getShop,{uid:app.globalData.uid},function (res) {
			   		console.log(res.data.data)
			   		console.log(res.data.data.mark)
			   		var cindex;
			   		var jimage = [];
			   		mypic = res.data.data.aptitude
			   		for (var i=0;i<res.data.data.aptitude.length;i++) {
			   			jimage.push(config.baseUrl+res.data.data.aptitude[i]);
			   		} 
			   		tempFilePaths2 = jimage;
			   		
			   		if (res.data.data.aptitude.length>9) {
			   			that.setData({
								isshow2:0,
							})
			   		} 
			   		var logo = [];
			   		logo[0] = config.baseUrl+res.data.data.logo;
			   		tempFilePaths1 = logo;
			   		mylogo[0] = res.data.data.logo
			   		tempFilePaths3[0] = config.baseUrl+res.data.data.id_cardz;
			   		tempFilePaths4[0] = config.baseUrl+res.data.data.id_cardf;
			   		console.log(res.data.data.id)
			   		that.setData({
		   				id:res.data.data.id,
		   				realname:res.data.data.realname,
		   				shop_name:res.data.data.shop_name,
							iphone:res.data.data.iphone,
							card_number:res.data.data.card_number, 
							adder_card:res.data.data.adder_card,
							uid:app.globalData.uid,
							adder:res.data.data.adder,
							mark:JSON.parse(res.data.data.mark),
							tempFilePaths1:logo,
							tempFilePaths2:jimage,
							tempFilePaths3:tempFilePaths3,
							tempFilePaths4:tempFilePaths4,
							isshow1:0,
						}); 
						wx.hideLoading();
				  }) 
				}
			}else{
				config.requstGet(config.shopsProtocol,{}, function(res) {
					isxieyi = isxieyi;
					that.setData({
						isxieyi:1,
						protocol:res.data.data.content
					})
				})
					
			}
		})
	},
	moveToLocation: function () {
		console.log("res");    
    var that = this;
    wx.chooseLocation({
      success: function (res) {    
        console.log(res);    
				that.setData({
					mark: {
						lat:res.latitude,
						lon:res.longitude
					}
				})
      } 
    });
 }, 
 getLocation: function() {
 	  var that = this;
	 	wx.getLocation({
		  type: 'wgs84',
		  success: function(res) {
		    console.log("授权成功！")
		    that.setData({
					isposition:1
				})
		  },
		  fail:function(res) {
		    console.log("授权失败！")
		    that.setData({
					isposition:0
				})
		  }
		})
	},
  //点击选择城市按钮显示picker-view
	translate: function(e) {
		model.animationEvents(this, 0, true, 400);
	},
	//隐藏picker-view
	hiddenFloatView: function(e) {
		model.animationEvents(this, 200, false, 400);
	},
	//滑动事件
	bindChange: function(e) {
		model.updateAreaData(this, 1, e);
		item = this.data.item;
		this.setData({
			adder:{
				province: item.provinces[item.value[0]].name,
				city: item.citys[item.value[1]].name,
				county: item.countys[item.value[2]].name
			}
		});
	},
	uploadImage:function(e){
		var that=this;
		if (e.currentTarget.dataset.type==2) {
			var len =9
		} else{
			var len =1;
		}
		wx.chooseImage({
	    count: len,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success:function(res){
	    	console.log(res.tempFilePaths)
	    	if (e.currentTarget.dataset.type==1) {
	    		console.log("==11===")
					tempFilePaths1[0]=res.tempFilePaths[0];
					if(tempFilePaths1.length>0){
		    		that.setData({
							 isshow1:0
						})	
		    	}
		    	that.setData({
						tempFilePaths1:tempFilePaths1
					})		
				} else if (e.currentTarget.dataset.type==2){
					console.log("==222===")
					for(var i=0;i<res.tempFilePaths.length;i++){
		    		tempFilePaths2.push(res.tempFilePaths[i]);
		    	}
		    	if(tempFilePaths2.length>8){
		    		that.setData({
							 isshow2:0
						})	
		    	}
		    	that.setData({
						tempFilePaths2:tempFilePaths2
					})	
				}else if (e.currentTarget.dataset.type==3){
		    	tempFilePaths3[0]=res.tempFilePaths[0];
		    	that.setData({
						tempFilePaths3:tempFilePaths3
					})	
		    }else if (e.currentTarget.dataset.type==4){
		    	tempFilePaths4[0]=res.tempFilePaths[0];
		    	that.setData({
						tempFilePaths4:tempFilePaths4
					})		
		    }
	    } 
		});
	}, 
	deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    if (e.currentTarget.dataset.type==1) {
    	tempFilePaths1.splice(index, 1);    
	    this.setData({
	      tempFilePaths1: tempFilePaths1
	    });
	    console.log(tempFilePaths1)
	    if(tempFilePaths1.length<1){
				this.setData({
					 isshow1:1
				})	
			}
    }else if (e.currentTarget.dataset.type==2){
    	tempFilePaths2.splice(index, 1);    
	    this.setData({
	      tempFilePaths2: tempFilePaths2
	    });
	    console.log(tempFilePaths2)
	    if(tempFilePaths2.length<9){
				this.setData({
					 isshow2:1
				})	
			}
    }
	    
	},
	imgYu:function(e){
		var src = e.currentTarget.dataset.src;//获取data-src
		//图片预览
		wx.previewImage({
			current: src,
			urls: e.currentTarget.dataset.yu // 需要预览的图片http链接列表
		})
	},
 	savePersonInfo: function(e) {
		var data = e.detail.value;
		data.adder = this.data.adder;
		data.mark = this.data.mark;
		data.logo = tempFilePaths1;
		if (tempFilePaths2.length>0) {
			data.aptitude = tempFilePaths2;
		}else{
			data.aptitude =""
		}
		data.id_cardz = tempFilePaths3;
		data.id_cardf = tempFilePaths4;
		data.uid = app.globalData.uid;
 
		var telRule = /^1[3|4|5|7|8]\d{9}$/,
			nameRule = /^[\u2E80-\u9FFF]+$/
		if(data.realname == '') {
			wx.showToast({
			  title: '请输入姓名',
			  icon: 'success',
			  duration: 2000
			})
		} else if(data.shop_name == '') {
			wx.showToast({
			  title: '请输入店名',
			  icon: 'success',
			  duration: 2000
			}) 
		} else if(data.iphone == '') {
			wx.showToast({
			  title: '请输入手机号',
			  icon: 'success',
			  duration: 2000
			})
		} else if(!telRule.test(data.iphone)) {
			wx.showToast({
			  title: '手机格式错误',
			  icon: 'success',
			  duration: 2000
			})
		} else if(data.adder.province == undefined) {
			wx.showToast({
			  title: '请选择城市',
			  icon: 'success',
			  duration: 2000
			}) 
		} else if(data.mark == undefined) {
			wx.showToast({
			  title: '请选择坐标',
			  icon: 'success',
			  duration: 2000
			}) 
		} else if(data.card_number == '') {
			wx.showToast({
			  title: '请输入银行卡号',
			  icon: 'success',
			  duration: 2000
			})
		} else if(tempFilePaths1.length == 0) {
			wx.showToast({
			  title: '请上传logo',
			  icon: 'success',
			  duration: 2000
			})
		} else if(tempFilePaths3.length == 0) {
			wx.showToast({
			  title: '请上传身份证正面',
			  icon: 'success',
			  duration: 2000
			})
		} else if(tempFilePaths4.length == 0) {
			wx.showToast({
			  title: '请上传身份证反面',
			  icon: 'success',
			  duration: 2000
			})
		} else {
			var that = this;
			wx.showLoading({
			  title: '数据提交中',
			})
			if (issy==1) {
				data.shop_id = that.data.id;
				console.log(data)
				updataurl(tempFilePaths1.length,tempFilePaths1,function () {
					console.log(tempFilePaths1);
					data.logo = tempFilePaths1[0];
					updataurl(tempFilePaths2.length,tempFilePaths2,function () {
						console.log(tempFilePaths2);
						data.aptitude = tempFilePaths2;
						updataurl(tempFilePaths3.length,tempFilePaths3,function () {
							console.log(tempFilePaths3);
							data.id_cardz = tempFilePaths3[0];
							updataurl(tempFilePaths4.length,tempFilePaths4,function () {
								console.log(tempFilePaths4);
								data.id_cardf = tempFilePaths4[0];
								console.log(data)
								config.requstPost(config.putEshop, data, function(res) {
									console.log(res)
									wx.hideLoading();
									if(res.data.code==0){
										wx.showModal({
										  title: '提交成功',
										  content: '请耐心等待审核！',
										  success: function(res) {
										    wx.navigateBack();
										  }
										})
									}else if(res.data.code==2){
										wx.showModal({
										  title: '提交失败',
										  content: res.data.data,
										  success: function(res) {
										  	that.onLoad()
//										    wx.navigateBack();
										  }
										})
									}else{
										wx.showModal({
										  title: '提交失败',
										  content: '请从新编辑！',
										  success: function(res) {
										  	that.onLoad()
//										    wx.navigateBack();
										  }
										})
									}
								})
							})
						})
					})
				})

			}else{
				var logo=[];
				var images = [];
				var cardz = [];
				var cardf = [];
				config.upImg(tempFilePaths1.length,config.upload,tempFilePaths1,logo,function () {
					console.log(logo)
					data.logo = logo[0];
					if (tempFilePaths2.length>0) {
						config.upImg(tempFilePaths2.length,config.upload,tempFilePaths2,images,function () {
							data.aptitude = images;
							config.upImg(tempFilePaths3.length,config.upload,tempFilePaths3,cardz,function () {
								data.id_cardz = cardz[0];
								config.upImg(tempFilePaths4.length,config.upload,tempFilePaths4,cardf,function () {
									data.id_cardf = cardf[0];
									console.log(data)
									config.requstPost(config.putShop, data, function(res) {
										console.log(res)
										wx.hideLoading();
										if(res.data.code==0){
											wx.showModal({
											  title: '提交成功',
											  content: '请耐心等待审核！',
											  success: function(res) {
											    wx.navigateBack();
											  }
											})
										}else{
											wx.showModal({
											  title: '提交失败',
											  content: '请从新编辑！',
											  success: function(res) {
											  	that.onLoad()
//											    wx.navigateBack();
											  }
											})
										}
									}) 
								}) 
							})	
						})
					} else{
						config.upImg(tempFilePaths3.length,config.upload,tempFilePaths3,cardz,function () {
							data.id_cardz = cardz[0];
							config.upImg(tempFilePaths4.length,config.upload,tempFilePaths4,cardf,function () {
								data.id_cardf = cardf[0];
								console.log(data)
								config.requstPost(config.putShop, data, function(res) {
									console.log(res)
									wx.hideLoading();
									if(res.data.code==0){
										wx.showModal({
										  title: '提交成功',
										  content: '请耐心等待审核！',
										  success: function(res) {
										    wx.navigateBack();
										  }
										})
									}else{
										wx.showModal({
										  title: '提交失败',
										  content: '请从新编辑！',
										  success: function(res) {
										  	that.onLoad()
//										    wx.navigateBack();
										  }
										})
									}
								}) 
							}) 
						})
					}
				})
			}
		}
	},
 	bindPickerChange: function(e) {
//  console.log('picker发送选择改变，携带值为', e.detail.value)
		classid = classinfo[e.detail.value].id;
		console.log(classid);
    this.setData({
      index: e.detail.value
    })
  },
  checkChange:function(e) {
    console.log(e.detail.value)
    if (e.detail.value=="已阅读") {
    	isxieyi = 0
    }else{
    	isxieyi = 1
    }
 
  },
  tongyi:function(e) {
    console.log(e.detail.value)
    if (isxieyi==0) {
    	this.setData({
				isxieyi:isxieyi
			})
    }else{
    	wx.showModal({
			  title: '提示',
			  content: '需先勾选已阅读！',
			  showCancel:false,
			  success: function(res) {
			  }
			})
    }
  }
})
function updataurl(i,temp,callback){
	i--;
	if(temp[i].indexOf(config.baseUrl) < 0){
	  config.upImgone(config.upload,temp[i],function (res) {
	  	temp[i] = res;
	  	console.log(temp[i]+"++++++++++");
	  	if(i==0){
				callback(temp) 
			}else{
				updataurl(i,temp,callback)
			}
	  })
	}else{
		temp[i] = temp[i].replace(config.baseUrl, '');
		console.log(temp[i]+"----");
		if(i==0){
			callback(temp) 
		}else{
			updataurl(i,temp,callback)
		}
	}
 
}
