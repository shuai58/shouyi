 var config = require('../../utils/config.js'); 
 var app = getApp();
 var navurl='';
 Page({
  data: {
  	
  },
  onLoad: function (res) {
 	console.log(res)
 	if (res.url!=undefined) {
 		navurl = res.url
 	} else{
 		navurl='';
 	}
  },
  getUserInfo:function (e) {
  	var that = this;
  	console.log(e)
  	if(e.detail.rawData != undefined) {
		console.log(e.detail.rawData)
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if(res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							app.globalData.userInfo = res.userInfo;
							console.log(res.userInfo)
							config.requstPost(config.userInfo, {
								nickname: res.userInfo.nickName,
								sex: res.userInfo.gender,
								uid: app.globalData.uid,
								avatar: res.userInfo.avatarUrl
							}, function(res) {
								console.log(res.data)
								app.globalData.shenfen = 1;
								if (navurl!='') {
									wx.redirectTo({
										url: navurl
									})
								}else{
									wx.navigateBack();	
								}
							})
						}
					})
				}
			}
		})
	}else{
		wx.navigateBack();
	}
  }
})
