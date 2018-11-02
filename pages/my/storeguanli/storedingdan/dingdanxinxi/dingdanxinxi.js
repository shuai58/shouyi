var config = require('../../../../../utils/config.js');  
var app = getApp();
var oid;
Page({
	data: {
		 
	},
	onLoad: function(res) {
		wx.setNavigationBarTitle({
		  title:"订单信息"
		})
		console.log(res)
		oid = res.orderid;
		wx.showLoading({
		  title: '加载中',
		});
		var that = this;
		config.requstGet(config.orderDateils,{id:oid},function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data.data
				for (var i = 0; i < getdata.group.length; i++) {
					getdata.group[i].image = config.baseUrl + getdata.group[i].image;
				} 
				getdata.addtime = timestampToTime(getdata.addtime);
				that.setData({
					dingdan: getdata
				}) 
			} 
	    })
 
	},
	sendbtn: function(e) {
 		var that = this;
		var data = e.detail.value;
		data.id = oid;
		if(trim(data.c_name)=='') {
			wx.showToast({
			  title: '请输入快递名！',
			  icon: 'none',
			  duration: 2000
			})
		}else if(trim(data.courier)=='') {
			wx.showToast({
			  title: '请输入快递单号！',
			  icon: 'none',
			  duration: 2000
			})
		}else{
			wx.showLoading({
			  title: '数据提交中！',
			});
			config.requstPost(config.putCnumber,data,function (res) {
				console.log(res.data.data)
				wx.hideLoading();
				if (res.data.code==0) {
					wx.showToast({
					  title: '发货成功！',
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
					  title: '发货失败！',
					  content: '请重新确认快递信息提交！',
					  showCancel:false,
					  success: function(res) {
					  }
					})
				}
		    })
		}
	}
})
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}
function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
} 

