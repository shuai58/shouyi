var city = require('../../utils/city.js');
var cityObjs = require('../../utils/city.js');
var config = require('../../utils/config.js');
var app = getApp();
var classdata = [];
var indexclass = [];
Page({
	data: {
		issucc:1,
		iscover:0,
		listData:[],
		scale: 14, //缩放
		Height: "0",
		controls: '40', //中心点
		latitude: '',
		longitude: '',
		markers: [],
		addnav: 0,
		navbox: 1,
		ismap: 1,
		isselect:0,
		searchLetter: [],
	    showLetter: "",
	    winHeight: 0,
	    cityList: [],
	    isShowLetter: false,
	    scrollTop: 0,//置顶高度
	    scrollTopId: '',//置顶id
	    city: "定位中",
	    currentCityCode: '',
	    inputName: '',
	    completeList: [],
	    county: '',
	    condition: false,
	    ison:1
	},
	onReady: function(e) {
		var that = this;
		that.userLocation();
		wx.getSystemInfo({
			success: function(res) {
				//设置map高度，根据当前设备宽高满屏显示
				that.setData({
					view: {
						Height: res.windowHeight - 100
					}
				})
			}
		})
	},
	onLoad: function() {
		wx.showLoading({
		  title: '数据加载中',
		})
		classdata = [];
		classdata[0] = {
			id:"no",
   			datalist:[]
		};
		var that = this;
		config.requstGet(config.getClass,{},function (res) {
   			console.log(res.data.data)
   			indexclass=res.data.data;
   			for (var i = 0; i < res.data.data.length; i++) {
   				classdata[i+1] ={
   					id:res.data.data[i].id,
   					datalist:[]
   				} 
   				indexclass[i].ison = 0;
   			}
			that.setData({
				indexclass: indexclass
			}); 
	    }) 	 
		const searchLetter = city.searchLetter;
		const cityList = city.cityList();
		const sysInfo = wx.getSystemInfoSync();
		const winHeight = sysInfo.windowHeight;
		const itemH = winHeight / searchLetter.length;
		let tempArr = [];
		searchLetter.map(
			(item, index) => {
				let temp = {};
				temp.name = item;
				temp.tHeight = index * itemH;
				temp.bHeight = (index + 1) * itemH;
				tempArr.push(temp)
			}
		);
		that.setData({
			winHeight: winHeight,
			itemH: itemH,
			searchLetter: tempArr,
			cityList: cityList
		});
	},
	controltap(e) {
		this.moveToLocation()
	},
	getSchoolMarkers() {
		var market = [];
		for(let item of this.data.listData) {
			let marker1 = this.createMarker(item);
			market.push(marker1)
		}
		this.setData({
			markers: market
		})
		return market;
	},
	moveToLocation: function() {
		this.mapCtx.moveToLocation()
	},
	createMarker(point) {
//		console.log(point)
		point.mark= JSON.parse(point.mark);
		let latitude = point.mark.lat//this.strSub();
		let longitude = point.mark.lon;
		var iconPath = point.pos_image;
//		console.log(iconPath)
		let marker = {
			iconPath:iconPath,//'/img/dw.png'
			id: point.id || 0,
			latitude: latitude,
			longitude: longitude,
			width: 59,
			height: 77,
			callout:{
				bgColor: "#48bdeb",
				content: point.title,
				color: "#ffffff",	
				display:"ALWAYS",
				fontSize:12,
				padding:4,
				borderRadius:10
			}
		};
		return marker;
	},
	markertap: function(e) {
		console.log(e)
		var that = this;
		for(let item of this.data.listData) {
			if(item.id == e.markerId) {
				var info = item;
				console.log(info)
				console.log(Number(info.placeLatitude), Number(info.placeLongitude))
				that.setData({
					shouyi:{
						name:info.title,
						img:info.logo,
						intro:info.abstract,
						phone:info.tel,
						urldata:JSON.stringify(info),
						urldata2:`lat=${info.mark.lat}&long=${info.mark.lon}&name=${info.title}&address=${info.adder.city+info.adder.county+info.adder.detail}`
					},
					iscover:1,
				})
				return;
			}
		}
	},
	addnav: function() {
		if(this.data.addnav == 0) {
			this.setData({
				addnav: 1
			})
		} else {
			this.setData({
				addnav: 0
			})
		}
	},
	isselect: function() {
		if(this.data.isselect == 0) {
			this.setData({
				isselect: 1,
				ismap: 0
			})
		} else {
			this.setData({
				isselect: 0,
				ismap: 1
			})
		}
	},
	//选择城市
	bindCity: function(e) {
		for (var i = 0; i < indexclass.length; i++) {
			indexclass[i].ison = 0;
		}
		this.setData({
			ison: 1,
			indexclass:indexclass
		}) 
		wx.showLoading({
		  title: '数据加载中',
		})
		var that = this;
		var url = `https://apis.map.qq.com/ws/geocoder/v1/?address=${e.currentTarget.dataset.city}市政府&key=${config.key}`;
		console.log(url)
		wx.request({
			url: url,
			success: res => {
				console.log(res.data.result)
				that.setData({
					scale: 14,
					longitude: res.data.result.location.lng,
					latitude: res.data.result.location.lat
				})
			},
			fail:res=>{
				console.log("获取经纬度失败！")
			}
		})
		
		this.setData({
			condition: true,
			city: e.currentTarget.dataset.city,
			scrollTop: 0,
			completeList: [],
		})
		app.globalData.defaultCity = this.data.city
		console.log(app.globalData.defaultCity)
		this.setData({
			isselect: 0,
			ismap: 1
		})
		for (var i = 0; i < classdata.length; i++) {
			if (classdata[i].id!="no") {
				classdata[i].datalist =[];
			} 
		}
		that.getdata(e.currentTarget.dataset.city);
	},
	bindBlur: function(e) {
		this.setData({
			inputName: ''
		})
	},
	bindKeyInput: function(e) {
		// console.log("input: " + e.detail.value);
		this.setData({
			inputName: e.detail.value,
			scrollTop: 0
		})
		if (e.detail.value=="") {
			this.setData({
				completeList: []
			})
		}
		this.auto()
	},
	auto: function() {
		let inputSd = this.data.inputName.trim()
		let sd = inputSd.toLowerCase()
		let num = sd.length
		const cityList = cityObjs.cityObjs
		// console.log(cityList.length)
		let finalCityList = []

		let temp = cityList.filter(
			item => {
				let text = item.short.slice(0, num).toLowerCase()
				return(text && text == sd)
			}
		)
		//在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
		let tempShorter = cityList.filter(
			itemShorter => {
				if(itemShorter.shorter) {
					let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
					return(textShorter && textShorter == sd)
				}
				return
			}
		)

		let tempChinese = cityList.filter(
			itemChinese => {
				let textChinese = itemChinese.city.slice(0, num)
				return(textChinese && textChinese == sd)
			}
		)

		if(temp[0]) {
			temp.map(
				item => {
					let testObj = {};
					testObj.city = item.city
					testObj.code = item.code
					finalCityList.push(testObj)
				}
			)
			this.setData({
				completeList: finalCityList,
			})
		} else if(tempShorter[0]) {
			tempShorter.map(
				item => {
					let testObj = {};
					testObj.city = item.city
					testObj.code = item.code
					finalCityList.push(testObj)
				}
			);
			this.setData({
				completeList: finalCityList,
			})
		} else if(tempChinese[0]) {
			tempChinese.map(
				item => {
					let testObj = {};
					testObj.city = item.city
					testObj.code = item.code
					finalCityList.push(testObj)
				})
			this.setData({
				completeList: finalCityList,phone
			})
		} else {
			return
		}
	},
	closeback: function() {
		var that = this;
		that.setData({
			iscover: 0,
		})
	},
	isshow: function(e) {
		console.log(e.currentTarget.dataset);
		var that = this;
		switch (e.currentTarget.dataset.type){
			case '1':
				wx.navigateTo({
				  url: `/pages/index/store/store?urldata=${e.currentTarget.dataset.urldata}&type=${e.currentTarget.dataset.type}` 
				})
				break;
			case '2':
				wx.navigateTo({
				  url: `/pages/index/store/store?urldata=${e.currentTarget.dataset.urldata}&type=${e.currentTarget.dataset.type}` 
				})
				break;
			default:
				break;
		}
		that.setData({
			iscover:0
		})
	},
	telclick: function(e) {
		console.log(e.currentTarget.dataset.phone)
		wx.makePhoneCall({
		  phoneNumber: e.currentTarget.dataset.phone
		})
	},
	navigateclick: function(e) {
		var info = JSON.parse(e.currentTarget.dataset.urldata);
		console.log(info)
		var that = this;
		var addre = info.adder.city+info.adder.county+info.title;
		wx.openLocation({
			latitude: Number(info.mark.lat),
			longitude: Number(info.mark.lon),
			scale: 14,
			name: info.title,
			address: addre
		})
	},
	userLocation: function() {
		var that = this;
		that.setData({
			isselect: 0,
			ismap: 1
		})
 		wx.getLocation({
			type: 'wgs84', //返回可以用于wx.openLocation的经纬度
			success: (res) => {
				console.log(res)
				that.setData({
					scale: 14,
					longitude: res.longitude,
					latitude: res.latitude
				})
				let latitude = res.latitude
				let longitude = res.longitude
				wx.request({
					url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
					success: res => {
						console.log(res.data.result.ad_info.city+res.data.result.ad_info.adcode);
						that.setData({
							city: res.data.result.ad_info.city,
							issucc:1
						})
						that.getdata(res.data.result.ad_info.city)
					},
					fail:res=>{
						that.setData({
							city: "定位失败",
							issucc:0,
							scale: 14,
							longitude: 113.62493,
							latitude: 34.74725
						})
						that.getdata('郑州市')
					}
				})
			},
			fail:res=>{ 
			    that.setData({
					city: "定位失败",
					issucc:0,
					scale: 14,
					longitude: 113.62493,
					latitude: 34.74725
				})
				that.getdata('郑州市')
			}
		}); 
	},
	getLocation: function() {
		this.userLocation();
	},
	classclick: function(e) {
		console.log(e.currentTarget.dataset)
		console.log(indexclass)
		for (var i = 0; i < indexclass.length; i++) {
			indexclass[i].ison = 0;
			if(indexclass[i].id==e.currentTarget.dataset.id){
				indexclass[i].ison = 1;
			}
			if (e.currentTarget.dataset.id=="no") {
				this.setData({
					ison: 1
				}) 
			}else{
				this.setData({
					ison: 0
				}) 
			}
		}
		for (var i = 0; i < classdata.length; i++) {
			if (e.currentTarget.dataset.id==classdata[i].id) {
				this.setData({
					listData: classdata[i].datalist
				}) 
			}
		}
		this.setData({
			indexclass: indexclass
		}) 
		this.getSchoolMarkers()
	},
	addshouyi: function() {
		console.log(app.globalData.shenfen);
		var that =this;
		that.setData({
			addnav:0
		});
		if(app.globalData.shenfen==0) {
			that.setData({
		      istrue: 1,
		      ismap: 0
		    })
		}else{
			wx.navigateTo({
				url: `/pages/shouyi/shouyi`
			})
		}
	},
	addstore: function() {
		console.log(app.globalData.shenfen);
		var that =this;
		that.setData({
			addnav:0
		});
		if(app.globalData.shenfen==0) {
			that.setData({
		      istrue: 1,
		      ismap: 0
		    })
		}else{
			wx.navigateTo({
				url: `/pages/kaidian/kaidian`
			})
		}
	},
	getdata:function (city) {
		var that = this;
		config.requstGet(config.showSki,{city:city},function (res) {
			console.log(res.data.data)
			if (res.data.data=="没有你想要的数据") {
				wx.hideLoading();
				wx.showToast({
				  title: '该城市没人入住手艺！',
				  icon: 'none',
				  duration: 2000
				})
			} else{
				download(res.data.data.length,res.data.data,function(res){
					console.log(res)
					that.setData({
						listData: res
					}) 
					wx.hideLoading();
					classdata[0].datalist = res;
					for (var i = 0; i < res.length; i++) {
						for (var j = 0; j < classdata.length; j++) {
							if (res[i].s_class == classdata[j].id) {
								classdata[j].datalist.push(res[i])
							} 
						}
					}
					console.log(classdata)
					that.getSchoolMarkers()
					wx.showModal({
					  title: '友情提示',
					  content: '点击地图头像,可了解更多手艺人信息！',
					  showCancel:false,
					  success: function(res) {}
					})
				})	
			}
				
	    }) 	 
	},
	quxiao() {
		this.setData({
	      istrue: 0,
	      ismap: 1
	    })
	},
	queding(e) {
		console.log(e)
		var that = this;
		that.setData({
	      istrue: 0,
	      ismap: 1
	    })
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
									wx.navigateTo({
										url: that.data.navurl
									})
								})
							}
						})
					}
				}
			})
		}
	},
	onShareAppMessage: function () {
	    return {
	      title: '手艺人',
	      path: '/pages/index/index'
	    }
	}
})
function download(i,downdata,callback){
	i--;
	var downurl = config.baseUrl+downdata[i].pos_image;
	downdata[i].logo=config.baseUrl+downdata[i].logo;
	console.log(downurl)
	wx.downloadFile({
	  url: downurl, //仅为示例，并非真实的资源
	  success: function(res) {
	    if (res.statusCode === 200) {
	    	downdata[i].pos_image = res.tempFilePath;
	    	if(i==0){
				callback(downdata) 
		  	}else{
		  		download(i,downdata,callback)
		  	}  	
	    }
	  }
	})
}
