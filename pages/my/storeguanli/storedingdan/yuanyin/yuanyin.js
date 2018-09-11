var config = require('../../../../../utils/config.js');  
var app = getApp();
var urldata;
Page({
	data: {
 
	},
	onLoad: function(res) {
		wx.setNavigationBarTitle({
		  title:"意见详情"
		})
		var that = this;
 		console.log(res)
 		urldata = JSON.parse(res.urldata); 
		wx.showLoading({
		  title: '加载中',
		});
		var that = this;
		config.requstGet(config.getCause,{oid:urldata.oid},function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data.data
				if(getdata.image==null){
				}else{
					for (var i = 0; i < getdata.image.length; i++) {
	 					getdata.image[i] = config.baseUrl + getdata.image[i];
	 				}
				}
	 				
 				that.setData({
					showdata:getdata
				})
			} 
	    })
	},
	istongyi:function (e) {
		wx.showLoading({
		  title: '提交中',
		});
		var state = e.currentTarget.dataset.type;
		var postdata = {};
		if (state==1) {
			postdata={
				oid:urldata.oid,
				state:state 
			}
		} else{
			postdata={
				oid:urldata.oid,
				state:state 
			}
		}
		config.requstPost(config.refunds,postdata,function (res) {
			console.log(res.data)
			wx.hideLoading();
			if (res.data.code==0) {
				wx.showToast({
				  title: '提交成功！',
				  icon: 'success',
				  duration: 2000
				}) 
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2];  
				prevPage.isselect(prevPage.data.isselect)
				setTimeout(function() {
					wx.navigateBack();
				}, 2000); 
			}else{
				wx.showModal({
				  title: '提交失败！',
				  content: '请重新提交！',
				  showCancel:false,
				  success: function(res) {
				  }
				})
			}
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
	}
})

