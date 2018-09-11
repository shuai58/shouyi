var config = require('../../utils/config.js'); 
var app = getApp();
var myphone;
Page({
  data: {
		userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow: function (res) {
  	wx.setNavigationBarTitle({
		  title:"我的" 
		})
  	var that = this;
  	if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
   }else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
		var userinfo = config.userinform(this,app)
		if (userinfo) {
      this.setData({
	      userInfo: userinfo,
	      hasUserInfo: true
	    })
  	} 
  },
  getUserInfo: function(e) {
    console.log(e.detail.userInfo)
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
								})
							}
						})
					}
				}
			})
		}
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.userInfo) {
      this.setData({
	      userInfo: e.detail.userInfo,
	      hasUserInfo: true
	    })
    } 
  },
  onLoad: function(res) {
  	config.requstGet(config.getRelation,{},function (res) {
  		console.log(res)
  		if (res.data.code==0) {
  			myphone = res.data.data.iphone
  		}
  	})
  },
  urlclick:function (e) {
  	if (app.globalData.shenfen==0) {
  		var url = '/pages/shouquan/shouquan?url='+e.currentTarget.dataset.url;
  	} else{
  		var myurl = e.currentTarget.dataset.url;
  		if (myurl=='/pages/my/storeguanli/storeguanli') {
  			if (app.globalData.level==2||app.globalData.level==3){
  				var url = e.currentTarget.dataset.url;
  			}else{
  				var url = "/pages/kaidian/kaidian";
  			}
  			 
  		}else if(myurl=='/pages/myfabu/myfabu') {
  			if (app.globalData.level==1||app.globalData.level==3){
  				var url = e.currentTarget.dataset.url;
  			}else{
  				var url = "/pages/shouyi/shouyi";
  			}
  		}else{
  			var  url = myurl;
  		}
  	}
  	wx.navigateTo({
			url: url
		})	
  },
  connect:function () {
  	wx.makePhoneCall({
		  phoneNumber: myphone
		})
  },
  about:function () {
  	 wx.navigateTo({
			url: '/pages/my/about/about'
		})	
  }
})

