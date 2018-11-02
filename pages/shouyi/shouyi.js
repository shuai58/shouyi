var config = require('../../utils/config.js'); 
var model = require('../../model/model.js');
var item = {};
const app = getApp();
var tempFilePaths1 = [];
var tempFilePaths2 = [];
var tempFilePaths3 = [];
var tempFilePaths4 = [];
var classinfo;
var classid;
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
		  title:"手艺资料"
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
		classinfo;
		classid;
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
  	config.requstGet(config.getClass,{},function (res) {
   		console.log(res.data.data)
   		classinfo = res.data.data
   		var classarray=[];
   		for (var i=0;i<res.data.data.length;i++) {
   			classarray.push(res.data.data[i].title)
   		} 
			that.setData({
				classarray:classarray 
			}); 
	  })
		config.requstGet(config.getVerdict,{uid:app.globalData.uid}, function(res) {
			console.log(res.data)
			if (res.data.code==0) {
				if (res.data.data.audit==0) {
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
				} else if (res.data.data.audit==2){
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
				} else if (res.data.data.audit==1){
					if (app.globalData.level==0) {
						app.globalData.level=1
					}else if(app.globalData.level==2){
						app.globalData.level=3
					}
					issy = 1;
					wx.showLoading({
					  title: '数据加载中',
					})
					config.requstGet(config.getSki,{uid:app.globalData.uid},function (res) {
			   		console.log(res.data.data)
			   		console.log(res.data.data.mark)
			   		var cindex;
			   		for (var i=0;i<classinfo.length;i++) {
			   			if (classinfo[i].id==res.data.data.s_class) {
			   				cindex = i;
			   			} 
			   		}
			   		var jimage = [];
			   		mypic = res.data.data.image
			   		for (var i=0;i<res.data.data.image.length;i++) {
			   			jimage.push(config.baseUrl+res.data.data.image[i]);
			   		} 
			   		tempFilePaths3 = jimage;
			   		
			   		if (res.data.data.image.length>9) {
			   			that.setData({
								isshow2:0,
							})
			   		} 
			   		var logo = [];
			   		logo[0] = config.baseUrl+res.data.data.logo;
			   		mylogo[0] = res.data.data.logo
			   		tempFilePaths4 = logo;
			   		classid = res.data.data.s_class;
			   		console.log(res.data.data.id)
			   		that.setData({
		   				id:res.data.data.id,
		   				title:res.data.data.title,
							abstract:res.data.data.abstract, 
							tel:res.data.data.tel,
							index:cindex,
							uid:app.globalData.uid,
							adder:res.data.data.adder,
							mark:JSON.parse(res.data.data.mark),
							tempFilePaths4:logo,
							tempFilePaths3:jimage,
							tempFilePaths1:tempFilePaths1,
							tempFilePaths2:tempFilePaths2,
							isshow1:0,
						});  
						wx.hideLoading();
				  }) 
				}
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
		if (e.currentTarget.dataset.type==1) {
			var len =1 - tempFilePaths1.length;
		} else{
			var len =9 - tempFilePaths2.length;
		}
		wx.chooseImage({
	    count: len,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success:function(res){
	    	console.log(res.tempFilePaths)
	    	if (e.currentTarget.dataset.type==1) {
					for(var i=0;i<res.tempFilePaths.length;i++){
		    		tempFilePaths1.push(res.tempFilePaths[i]);
		    	}
		    	if(tempFilePaths1.length>0){
		    		that.setData({
							 isshow1:0
						})	
		    	}
		    	that.setData({
						tempFilePaths1:tempFilePaths1
					})	
				} else{
					for(var i=0;i<res.tempFilePaths.length;i++){
		    		tempFilePaths2.push(res.tempFilePaths[i]);
		    	}
					var imglen = tempFilePaths2.length+tempFilePaths3.length;
		    	if(imglen>8){
		    		that.setData({
							 isshow2:0
						})	
		    	}
		    	that.setData({
						tempFilePaths2:tempFilePaths2
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
	    if(tempFilePaths1.length<1){
				this.setData({
					 isshow1:1
				})	
			}
    } else if (e.currentTarget.dataset.type==4){
    	tempFilePaths4.splice(index, 1);  
    	mylogo.splice(index, 1); 
	    this.setData({
	      tempFilePaths4: tempFilePaths4
	    });
	    var imglen = tempFilePaths4.length+tempFilePaths1.length;
	    if(imglen<1){
				this.setData({
					 isshow1:1
				})	
			}else{
				this.setData({
					 isshow1:0
				})	
			}
    } else if (e.currentTarget.dataset.type==2){
    	tempFilePaths2.splice(index, 1);    
	    this.setData({
	      tempFilePaths2: tempFilePaths2
	    });
	    var imglen = tempFilePaths2.length+tempFilePaths3.length;
	    if(imglen<9){
				this.setData({
					 isshow2:1
				})	
			}
    } else if (e.currentTarget.dataset.type==3){
    	tempFilePaths3.splice(index, 1);   
    	mypic.splice(index, 1);
	    this.setData({
	      tempFilePaths3: tempFilePaths3
	    });
	    var imglen = tempFilePaths2.length+tempFilePaths3.length;
	    if(imglen<9){
				this.setData({
					 isshow2:1
				})	
			}else{
				this.setData({
					 isshow2:0
				})	
			}
    }
	    
	},
	imgYu:function(e){
		var src = e.currentTarget.dataset.src;//获取data-src
		if (e.currentTarget.dataset.type==1) {
    	var imgList2 = tempFilePaths1;
    } else{
    	var imgList2 = tempFilePaths2; 
    }
		console.log(imgList2)
		//图片预览
		wx.previewImage({
			current: src,
			urls: imgList2 // 需要预览的图片http链接列表
		})
	},
 	savePersonInfo: function(e) {
		var data = e.detail.value;
		data.adder = this.data.adder;
		data.mark = this.data.mark;
		data.s_class = classid;
		data.uid = app.globalData.uid;
		if (issy==0) {
			data.logo = tempFilePaths1;
			data.image = tempFilePaths2;
		} 
//		console.log(data);
		var telRule = /^1[3|4|5|7|8]\d{9}$/,
			nameRule = /^[\u2E80-\u9FFF]+$/
		if(data.title == '') {
			wx.showToast({
			  title: '请输入手艺名',
			  icon: 'success',
			  duration: 2000
			})
		} else if(data.s_class == undefined) {
			wx.showToast({
			  title: '请选择分类',
			  icon: 'success',
			  duration: 2000
			}) 
		} else if(data.tel == '') {
			wx.showToast({
			  title: '请输入手机号',
			  icon: 'success',
			  duration: 2000
			})
		} else if(!telRule.test(data.tel)) {
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
		} else if(data.abstract == '') {
			wx.showToast({
			  title: '请输入简介',
			  icon: 'success',
			  duration: 2000
			})
		} else if(tempFilePaths1.length == 0&&tempFilePaths4.length == 0) {
			wx.showToast({
			  title: '请上传logo',
			  icon: 'success',
			  duration: 2000
			})
		} else if(tempFilePaths2.length == 0&&tempFilePaths3.length == 0) {
			wx.showToast({
			  title: '请上传图片',
			  icon: 'success',
			  duration: 2000
			})
		} else {
			wx.showLoading({
			  title: '数据提交中',
			})
			var that = this;
			if (issy==1) {
				data.ski_id = that.data.id;
				var logo=[];
				var images = [];
				if (tempFilePaths1.length>0) {
					config.upImg(tempFilePaths1.length,config.upload,tempFilePaths1,logo,function () {
						console.log(logo)
						data.logo = logo[0];
						if (tempFilePaths2.length>0) {
							config.upImg(tempFilePaths2.length,config.upload,tempFilePaths2,images,function () {
								console.log(images)
								if (mypic.length>0) {
									for (var i = 0;i<mypic.length;i++) {
										images.push(mypic[i])
									}
								}
								data.image = images;
								console.log(data)
								that.postdata(data);
							})
						}else{
							data.image = mypic;
							console.log(data)
							that.postdata(data);							
						}
							
					})
				} else{
					data.logo = mylogo[0];
					if (tempFilePaths2.length>0) {
							config.upImg(tempFilePaths2.length,config.upload,tempFilePaths2,images,function () {
								console.log(images)
								if (mypic.length>0) {
									for (var i = 0;i<mypic.length;i++) {
										images.push(mypic[i])
									}
								}
								data.image = images;
								console.log(data)
								that.postdata(data);
							})
						}else{
							data.image = mypic;
							console.log(data)
							that.postdata(data);							
						}
				}
				 
			} else{
				console.log(data)
				var logo=[];
				var images = [];
				config.upImg(tempFilePaths1.length,config.upload,tempFilePaths1,logo,function () {
					console.log(logo)
					data.logo = logo[0];
					config.upImg(tempFilePaths2.length,config.upload,tempFilePaths2,images,function () {
						console.log(images)
						data.image = images;
						console.log(data)
						config.requstPost(config.putSki, data, function(res) {
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
								  	that.onLoad();
				//								    wx.navigateBack();
								  }
								})
							}
						})
					})
				})
			}
		}
	},
	postdata:function (data){
		var that = this;
		config.requstPost(config.putSkiE, data, function(res) {
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
				  	that.onLoad();
				  }
				})
			}else{
				wx.showModal({
				  title: '提交失败',
				  content: "请从新编辑！",
				  success: function(res) {
				  	that.onLoad();
				  }
				})
			}
		})
	},
 	bindPickerChange: function(e) {
		classid = classinfo[e.detail.value].id;
		console.log(classid);
    this.setData({
      index: e.detail.value
    })
  }
})

