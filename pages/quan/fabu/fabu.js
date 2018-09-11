var config = require('../../../utils/config.js'); 
const app = getApp()
var tempFilePaths = [];
var rules = [];
var locations = '';
var cid = '';
var rulesid = '';
Page({
  data: {
		isshow:1,
		ischeck:true,
		positon:"获取位置中",
		day: [],
		index:0
  },
  onLoad: function (res) {
  	tempFilePaths = [];
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
		wx.getLocation({
			type: 'wgs84', //返回可以用于wx.openLocation的经纬度
			success: (res) => {
				that.setData({
					isposition:1
				})
				let latitude = res.latitude
				let longitude = res.longitude
				wx.request({
					url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
					success: res => {
						console.log(res.data.result.address);
						locations=res.data.result.address;
						that.setData({
							positon: res.data.result.address
						})
					},
					fail:res=>{
						that.setData({
							positon: "获取位置失败" 
						})
					}
				})
			},
			fail:res=>{
				that.setData({
					positon: "获取位置失败",
					isposition:0
				})
			}
		});
  	
  },
  uploadImage:function(e){
		var that=this;
		var len =9 - tempFilePaths.length;
		wx.chooseImage({
	    count: len,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success:function(res){
	    	console.log(res.tempFilePaths)
	    	for(var i=0;i<res.tempFilePaths.length;i++){
	    		tempFilePaths.push(res.tempFilePaths[i]);
	    	}
	    	if(tempFilePaths.length>8){
	    		that.setData({
						 isshow:0
					})	
	    	}
	    	that.setData({
					tempFilePaths:tempFilePaths
				})	
	    	console.log(tempFilePaths)
	    } 
		});
	}, 
	deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    tempFilePaths.splice(index, 1);    
    this.setData({
      tempFilePaths: tempFilePaths
    });
    if(tempFilePaths.length<9){
			this.setData({
				 isshow:1
			})	
		}
	},
	imgYu:function(event){
		var src = event.currentTarget.dataset.src;//获取data-src
		var imgList2 = tempFilePaths;
		console.log(imgList2)
		//图片预览
		wx.previewImage({
			current: src,
			urls: imgList2 // 需要预览的图片http链接列表
		})
	},
	switchChange:function(e){
		var that = this;
		console.log(e.detail.value)
		that.setData({
			ischeck:e.detail.value
		})
	},
	moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {    
        console.log(res);   
        locations=res.address;
				that.setData({
					positon: res.address
				})
      } 
    });
 },
 getLocation: function() {
 	  var that = this;
	 	wx.getLocation({
			type: 'wgs84', //返回可以用于wx.openLocation的经纬度
			success: (res) => {
				that.setData({
					isposition:1
				})
				let latitude = res.latitude
				let longitude = res.longitude
				wx.request({
					url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
					success: res => {
						console.log(res.data.result.address);
						that.setData({
							positon: res.data.result.address
						})
					},
					fail:res=>{
						that.setData({
							positon: "获取位置失败" 
						})
					}
				})
			},
			fail:res=>{
				that.setData({
					positon: "获取位置失败",
					isposition:0
				})
			}
		});
	},
	bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      morey:rules[e.detail.value].price
    })
    rulesid = rules[e.detail.value].id
 },
 savePersonInfo: function(e) {
 		var that = this;
		var data = e.detail.value;
		data.locations = locations;
		data.image = tempFilePaths;
		data.uid = app.globalData.uid;
 
		var telRule = /^1[3|4|5|7|8]\d{9}$/,
			nameRule = /^[\u2E80-\u9FFF]+$/
		if(trim(data.content)==''&&data.image.length<=0) {
			wx.showToast({
			  title: '请输入内容或图片！',
			  icon: 'none',
			  duration: 2000
			}) 
		} else if(data.locations == undefined) {
			wx.showToast({
			  title: '请选择位置',
			  icon: 'success',
			  duration: 2000
			}) 
		} else if(data.iphone == '') {
			wx.showToast({
			  title: '请输入手机号',
			  icon: 'none',
			  duration: 2000
			})
		} else if(!telRule.test(data.iphone)) {
			wx.showToast({
			  title: '手机格式错误',
			  icon: 'none',
			  duration: 2000
			})
		}else{
			wx.showLoading({
			  title: '数据提交中'
			})
			console.log(data);
			updataurl(tempFilePaths.length,tempFilePaths,function () {
				data.image = tempFilePaths;	
				console.log(data)
				config.requstPost(config.publish, data, function(res) {
					console.log(res)
					wx.hideLoading();
					if(res.data.code==0){
						if(that.data.ischeck==true){
							cid = res.data.cid;
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
												wx.showModal({
												  title: '支付成功!',
												  content: '已成功发布并置顶！',
												  showCancel:false,
												  success: function(res) {
												  	wx.navigateBack();
												  }
												})
									  },
									  'fail':function(res){
										  wx.showModal({
											  title: '支付失败!',
											  content: '已发布成功！可在我发布中从新置顶！',
											  showCancel:false,
											  success: function(res) {
											  	wx.navigateBack();
											  }
											})
									  }
									})
								}else{
									wx.showModal({
									  title: '置顶失败',
									  content: res.data.data,
									  showCancel:false,
									  success: function(res) {
									  	wx.navigateBack();
									  }
									})
								}
							})
						}else{
							wx.showToast({
							  title: '发布成功',
							  icon: 'success',
							  duration: 2000,
							  success: function(res) {
							  	wx.navigateBack();
						  	}
							}) 
						}
					}else{
						wx.showModal({
						  title: '提交失败',
						  content: '请从新提交！',
						  success: function(res) {
						    wx.navigateBack();
						  }
						})
					}
				})   
			}) 
		}
	}
})
function updataurl(i,temp,callback){
	if (i>0) {
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
	} else{
		callback(temp) 
	}
}
function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
} 

