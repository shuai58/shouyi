var config = require('../../../utils/config.js');  
var app = getApp();
Page({
	data: {
 
	},
	onLoad: function(res) {
		wx.setNavigationBarTitle({
		  title:"评价详情"
		})
		var that = this;
 		console.log(res)
		wx.showLoading({
		  title: '加载中',
		});
		var that = this;
		config.requstGet(config.putEvaluate,{uid:app.globalData.uid,oid:res.oid},function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data.data;
				if (getdata.image!=null&&getdata.image.length>0) {
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

