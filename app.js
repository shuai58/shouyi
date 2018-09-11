//app.js
var config = require('/utils/config.js');
App({
	globalData: {
		userInfo: '',
		uid: '',
		shenfen: 0,
		level:'',
		shop_id:''
	},
	onLaunch: function(res) {
		var that = this;
		console.log(res )
		// 登录
		wx.login({
			success: res => {
				config.requstGet(config.onLogin, {
					code: res.code
				}, function(res) {
					console.log(res.data)
					that.globalData.uid = res.data.uid;
					that.globalData.shenfen = res.data.sta;
					if (that.globalData.shenfen!=0) {
						that.globalData.level = res.data.level;
						if(res.data.level==2||res.data.level==3){
							that.globalData.shop_id = res.data.shop.id;
						}
					}
					that.getSetting();
				})
			}
		})
	},
	getSetting:function () {
		var that = this;
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if(res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							that.globalData.userInfo = res.userInfo;
							console.log(res.userInfo)
							config.requstPost(config.userInfo, {
								nickname: res.userInfo.nickName,
								sex: res.userInfo.gender,
								uid: that.globalData.uid,
								avatar: res.userInfo.avatarUrl
							}, function(res) {
								console.log(res.data)
							})
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if(this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	}

})

function upImg(i, upurl) {
	i--;
	wx.uploadFile({
		url: upurl,
		header: {
			"Content-type": "multipart/form-data"
		},
		filePath: tempFilePaths[i],
		name: 'PICTURE',
		success: function(res) {
			console.log(res)
			if(i == 0) {
				wx.hideLoading();
				return;
			} else {
				upImg(i, upurl)
			}
		}
	})
}
