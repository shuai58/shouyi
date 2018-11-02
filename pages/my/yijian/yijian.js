var config = require('../../../utils/config.js');
const app = getApp()
var tempFilePaths = [];
var resdata={}; 
Page({
  data: {
 		isshow:1
  },
  onLoad: function (res) {
  	console.log(res)
  	if (res.oid!=undefined) {
  		wx.setNavigationBarTitle({
			  title:"退款原因"
			})
  		resdata = res
  	}else{
  		resdata={}
  	}
    tempFilePaths = [];
  },
	formSubmit: function(e) {
		var data = e.detail.value
	  if (trim(data.content) == '') {
      wx.showToast({
			  title: '提交不能为空!',
			  icon: 'none',
			  duration: 2000
			})
    }else{
    	wx.showLoading({
			  title: '数据提交中！',
			});
    	var formdata = e.detail.value;
    	formdata.uid = app.globalData.uid;
    	if(resdata.oid!=undefined){
    		formdata.oid = resdata.oid;
    		formdata.shop_id = resdata.shop_id;
    		var posturl = config.refund
    	}else{
    		var posturl = config.putFeedback
    	}
    	updataurl(tempFilePaths.length,tempFilePaths,function () {
    		formdata.image = tempFilePaths;
    		console.log(formdata)
    		config.requstPost(posturl,formdata,function(data){
	 				wx.hideLoading();
	    		if(data.data.code==0){
						wx.showToast({
						  title: '提交成功',
						  icon: 'success',
						  duration: 2000
						})
						if (posturl==config.refund) {
							var pages = getCurrentPages();
							var prevPage = pages[pages.length - 2];  
							prevPage.isselect(prevPage.data.isselect)
						} 
	    			setTimeout(function(){   
							wx.navigateBack();
						},2000);
					}else{
						wx.showModal({
						  title: '提示',
						  content: '提交失败，请重新提交！',
						  success: function(res) { 
						  }
						})
					}
	    	})
    	})	
    }
	},
	uploadImage:function(e){
		var that=this;
		var len =4 - tempFilePaths.length;
		wx.chooseImage({
	    count: len,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success:function(res){
	    	console.log(res.tempFilePaths)
	    	for(var i=0;i<res.tempFilePaths.length;i++){
	    		tempFilePaths.push(res.tempFilePaths[i]);
	    	}
	    	if(tempFilePaths.length>3){
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
	    if(tempFilePaths.length<4){
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
