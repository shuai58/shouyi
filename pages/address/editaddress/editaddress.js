var config = require('../../../utils/config.js');
var model = require('../../../model/model.js')
const app = getApp();
var show = false;
var item = {};
var isedit=0;
Page({
	data: {
		item: {
			show: show,
			showMessage: false,
			messageContent: ''
		},
		deldata:{}
	},
	onReady: function(e) {
		var that = this;
		//请求数据
		model.updateAreaData(that, 0, e);
	},
	onLoad: function(res) {
		wx.setNavigationBarTitle({
		  title:"地址编辑"
		})
		isedit=0;
		if (res.deldata!=undefined) {
			isedit=1;
			console.log(res.deldata)
			var that = this; 
			var deldata = JSON.parse(res.deldata);
			that.setData({
				deldata: deldata,
				province:deldata.adder.province,
				city:deldata.adder.city,
				county:deldata.adder.county
			}); 
		} 
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
			province: item.provinces[item.value[0]].name,
			city: item.citys[item.value[1]].name,
			county: item.countys[item.value[2]].name
		});
	},
	savePersonInfo: function(e) {
		var data = e.detail.value;
		data.province = this.data.province;
		data.city = this.data.city;
		data.county = this.data.county;
		data.state = 1;
		if (isedit==1) {
			data.id= this.data.deldata.id;
		} 
		console.log(data);
		var telRule = /^1[3|4|5|7|8]\d{9}$/,
			nameRule = /^[\u2E80-\u9FFF]+$/
		if(data.name == '') {
			this.showMessage('请输入姓名')
		} else if(data.iphone == '') {
			this.showMessage('请输入手机号码')
		} else if(!telRule.test(data.iphone)) {
			this.showMessage('手机号码格式不正确')
		} else if(data.province == undefined) {
			this.showMessage('请选择所在省')
		} else if(data.city == undefined) {
			this.showMessage('请选择所在市')
		} else if(data.county == undefined) {
			this.showMessage('请选择所在区')
		} else if(data.detail == '') {
			this.showMessage('请输入详细地址')
		} else {
			var that = this;
			data.uid = app.globalData.uid;
			console.log(data)
			if (isedit==0) {
				config.requstPost(config.putAdder, data, function(res) {
					console.log(res.data)
					if(res.data.code == 0) {
						wx.showToast({
							title: '提交成功',
							icon: 'success',
							duration: 2000
						})
						setTimeout(function() {
							wx.navigateBack();
						}, 2000);
					} else {
						wx.showToast({
							title: '提交失败',
							icon: 'success',
							duration: 2000
						})
					}
	
				})
			} else{
				config.requstPost(config.putEdit, data, function(res) {
					console.log(res.data)
					if(res.data.code == 0) {
						wx.showToast({
							title: '修改成功',
							icon: 'success',
							duration: 2000
						})
						setTimeout(function() {
							wx.navigateBack();
						}, 2000);
					} else {
						wx.showToast({
							title: '修改失败',
							icon: 'success',
							duration: 2000
						})
					}
				}) 
			}				
		}
	},
	showMessage: function(text) {
		var that = this
		that.setData({
			showMessage: true,
			messageContent: text
		})
		setTimeout(function() {
			that.setData({
				showMessage: false,
				messageContent: ''
			})
		}, 3000)
	}
})