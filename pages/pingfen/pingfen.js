var config = require('../../utils/config.js'); 
const app = getApp()
var tempFilePaths = [];
var content = "";
var resdata={}; 
Page({
  data: {
		isshow:1,
		score:0
  },
  onLoad: function (res) {
  	var that = this;
  	wx.setNavigationBarTitle({
			  title:"评价"
			})
  	tempFilePaths = [];
  	content = "";
  	resdata = res;
  	resdata.id= JSON.parse(resdata.id)
  	console.log(resdata)
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
	imgYu:function(e){
		var src = e.currentTarget.dataset.src;//获取data-src
		var imgList2 = tempFilePaths;
		console.log(imgList2)
		//图片预览
		wx.previewImage({
			current: src,
			urls: imgList2 // 需要预览的图片http链接列表
		})
	},
	starclick:function(e){
		console.log(e.currentTarget.dataset.index)
		var num = e.currentTarget.dataset.index+1;
		if(e.currentTarget.dataset.index==0&&this.data.score==1){
			num = 0;
		}
		this.setData({
			score:num
		})		
	},
	bindTextAreaBlur:function(e){
		content=e.detail.value;
	},
	save:function(){
		var data = {};
		data.score = this.data.score;
		data.reply = content;
		data.uid = app.globalData.uid;
		data.good_id = resdata.id;
		data.oid = resdata.oid;
		console.log(data)
 		if (trim(data.reply)=="") {
 			wx.showToast({
			  title: '评论内容不能为空!',
			  icon: 'none',
			  duration: 2000
			})
 		} else{
 			updataurl(tempFilePaths.length,tempFilePaths,function () {
 				data.image = tempFilePaths;
 				console.log(data)
    		config.requstPost(config.putDiscuss,data,function(data){
	 				wx.hideLoading();
	    		if(data.data.code==0){
						wx.showToast({
						  title: '提交成功',
						  icon: 'success',
						  duration: 2000
						})
						var pages = getCurrentPages();
						var prevPage = pages[pages.length - 2];
						prevPage.isselect(prevPage.data.isselect)
	    			setTimeout(function(){   
							wx.navigateBack();
						},2000);
					}else if(data.data.code==2){
						wx.showModal({
						  title: '提示',
						  content:data.data.data,
						  success: function(res) { 
						  	wx.navigateBack();
						  }
						})
					}else{
						wx.showModal({
						  title: '提示',
						  content: '提交失败，请重新评价！',
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
