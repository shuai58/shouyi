var config = require('../../../utils/config.js'); 
var app = getApp();
var navlist=[];
var page = 0;
var postdata = {};
var index = 0;
var hongbaoli = [];
var jprice = 0;
var packetid ="";
var packet =0;
var edata ={};
Page({
	data: {
		isselect: 0,
		zhifu:0,
		hongbao:0
	},
	onLoad: function() {
		wx.setNavigationBarTitle({
		  title:"我的订单"
		})
		wx.showLoading({
		  title: '数据加载中',
		})
		edata ={};
		index = 0;
		packetid ="";
		packet =0;
		page = 0;
		hongbaoli = [];
 		config.requstGet(config.getPacke,{uid:app.globalData.uid},function (res) {
	   		if(res.data.code==0) {
	   			var hbdata = res.data.data;
	   			for (var i = 0; i<hbdata.length;i++) {
					hbdata[i].overtime=format(hbdata[i].overtime)
   					if (hbdata[i].shop_id==0) {
   						hbdata[i].isxx = 0;
	   					hongbaoli.push(hbdata[i]);
	   				} 
	   			}
	   			console.log(hongbaoli)
	   			that.setData({
					hongbaoli:hongbaoli
				})
	   		}	
	    })	
		var that = this;
		that.setData({
			isselect: 0,
			zhifu:0,
			hongbao:0
		}) 
		console.log(navlist)
		postdata = {
			uid:app.globalData.uid,
			statu:4,
			p:page
		}
	  	that.getData();
	},
	isselect: function(e) {
		var that = this;
		page = 0;
		if(e.currentTarget!=undefined){
			index=e.currentTarget.dataset.id;
		}else{
			index=e;
		}
		switch (index){
			case '0':
				postdata = {
					uid:app.globalData.uid,
					statu:4,
					p:page
				}
			  	that.getData();
				break;
			case '1':
				postdata = {
					uid:app.globalData.uid,
					statu:0,
					p:page
				}
			  	that.getData();
				break;
			case '2':
				postdata = {
					uid:app.globalData.uid,
					statu:1,
					delivery:0,
					p:page
				}
			  	that.getData();
				break;
			case '3':
				postdata = {
					uid:app.globalData.uid,
					statu:1,
					delivery:1,
					p:page
				}
			  	that.getData();
				break;
			case '4':
				postdata = {
					uid:app.globalData.uid,
					statu:4,
					is_evaluate:0,
					p:page
				}
			  	that.getData();
				break;
			case '5':
				postdata = {
					uid:app.globalData.uid,
					is_refund:1,
					p:page
				}
			  	that.getData();
				break;
			default:
				break;
		}
		this.setData({
			isselect: index
		})
	},
	onReachBottom:function (e) {
		var that = this;
 		wx.showLoading({
		  title: '加载中',
		});
		page++; 
		postdata.p=page
		config.requstGet(config.getOrder,postdata,function (res) {
			console.log(res.data.data)
			wx.hideLoading();
			if (res.data.code==0) {
				var getdata = res.data.data
				for (var i = 0; i < getdata.length; i++) {
					getdata[i].shop_img = config.baseUrl + getdata[i].shop_img;
					for (var j = 0; j < getdata[i].group.length; j++) {
						getdata[i].group[j].image = config.baseUrl + getdata[i].group[j].image;
					}
					navlist.push(getdata[i])
				} 
				that.setData({
					dingdan: navlist
				}) 
			}else{
				page =page-1; 
				wx.showToast({
				  title: '没有更多数据了！',
				  icon: 'none',
				  duration: 2000
				})
			}
	    })
		console.log(navlist)
	},
	getData:function () {
		var that = this;
		navlist = [];
		config.requstGet(config.getOrder,postdata,function (res) {
	  		wx.hideLoading();
	  		console.log(res.data.data)
			if (res.data.code==0) {
				var getdata = res.data.data
				for (var i = 0; i < getdata.length; i++) {
					getdata[i].shop_img = config.baseUrl + getdata[i].shop_img;
					for (var j = 0; j < getdata[i].group.length; j++) {
						getdata[i].group[j].image = config.baseUrl + getdata[i].group[j].image;
					}
					navlist.push(getdata[i])
				} 
				that.setData({
					dingdan: navlist 
				}) 
			}
	  	})
		that.setData({
			dingdan: navlist 
		}) 
	},
	del:function (e) {
		var oid = e.currentTarget.dataset.id;
		var that = this;
		wx.showModal({
		  title: '友情提示',
		  content: '你确定要删除订单记录！删除后你将无法撤回!',
		  success: function(res) {
		    if (res.confirm) {
		    	wx.showLoading({
				  title: '删除中！',
				});
		       config.requstGet(config.delOrderRecord,{id:oid,is_del:1},function (res) {
					console.log(res.data.data)
					wx.hideLoading();
					if (res.data.code==0) {
						wx.showToast({
						  title: '删除成功！',
						  icon: 'success',
						  duration: 2000
						}) 
						that.isselect(index+"");
					} 
			    })
		    } else if (res.cancel) {
		      console.log('用户点击取消')
		    }
		  }
		})
	},
	quxiao:function (e) {
		var oid = e.currentTarget.dataset.id;
		var that = this;
		wx.showModal({
		  title: '友情提示',
		  content: '你确定要取消订单！',
		  success: function(res) {
		    if (res.confirm) {
		    	wx.showLoading({
				  title: '取消中！',
				});
		       config.requstGet(config.delOrder,{id:oid},function (res) {
					console.log(res.data.data)
					wx.hideLoading();
					if (res.data.code==0) {
						wx.showToast({
						  title: '取消成功！',
						  icon: 'success',
						  duration: 2000
						}) 
						that.isselect(index+"");
					} 
			    })
		    } 
		  }
		})
	},
	putRecall:function (e) {
		var oid = e.currentTarget.dataset.id;
		var that = this;
		wx.showModal({
		  title: '友情提示',
		  content: '你确定要撤销退款！',
		  success: function(res) {
		    if (res.confirm) {
		    	wx.showLoading({
				  title: '撤销中！',
				});
		       config.requstGet(config.putRecall,{id:oid},function (res) {
					console.log(res.data.data)
					wx.hideLoading();
					if (res.data.code==0) {
						wx.showToast({
						  title: '撤销成功！',
						  icon: 'success',
						  duration: 2000
						}) 
						that.isselect(index+"");
					}else{
						wx.showToast({
						  title: res.data.data,
						  icon: 'none',
						  duration: 2000
						}) 
					}
			    })
		    } 
		  }
		})
	},
	putAffirm:function (e) {
		console.log(e.currentTarget.dataset) 
		var oid=e.currentTarget.dataset.id;
		var gid=e.currentTarget.dataset.gid;
		var gidarr = [];
 		for (var i = 0; i < gid.length; i++) {
 			gidarr.push(gid[i].gid);
 		}
		console.log(gidarr) 
		gidarr =JSON.stringify(gidarr); 
		var that = this;
		wx.showModal({
		  title: '友情提示',
		  content: '你确定确定，已收到货！',
		  success: function(res) {
		    if (res.confirm) {
		    	wx.showLoading({
				  title: '提交中！',
				});
		        config.requstGet(config.putAffirm,{id:oid},function (res) {
					console.log(res.data.data)
					wx.hideLoading();
					if (res.data.code==0) {
						wx.showToast({
						  title: '提交成功！',
						  icon: 'success',
						  duration: 2000
						}) 
						that.isselect(index+"");
						wx.navigateTo({
							url:`/pages/pingfen/pingfen?oid=${oid}&&id=${gidarr}`
						})	
					} 
			    })
		    } 
		  }
		})
	},  
	pingjia:function (e) {
		console.log(e.currentTarget.dataset) 
		var oid=e.currentTarget.dataset.id;
		var gid=e.currentTarget.dataset.gid;
		var gidarr = [];
 		for (var i = 0; i < gid.length; i++) {
 			gidarr.push(gid[i].gid);
 		}
		console.log(gidarr) 
		gidarr =JSON.stringify(gidarr); 
		wx.navigateTo({
			url:`/pages/pingfen/pingfen?oid=${oid}&&id=${gidarr}`
		})	
	},
	close:function(e) {
		this.setData({
			zhifu:0,
			hongbao:0 
		})
	},
	close2:function(e) {
		this.setData({
			hongbao:0 
		})
	},
	hongbao:function(e) {
		var that = this;
		that.setData({
			hongbao:1
		})
	},
	pay:function(e) {
		console.log(e.currentTarget.dataset)
		edata = e.currentTarget.dataset.dingdan;
		jprice = 0;
		for (var i = 0; i < edata.group.length; i++) {
			jprice =(parseFloat(jprice)+parseFloat(edata.group[i].unit_price)).toFixed(2);
		}
		console.log("jiage"+jprice)
		for (var i = 0; i < hongbaoli.length; i++) {
			if (jprice>=hongbaoli[i].rule) {
				for (var j = 0; j<hongbaoli.length;j++) {
					hongbaoli[j].isxx=0;
				}
				hongbaoli[i].isxx=1;
				packet = hongbaoli[i].price
				packetid = hongbaoli[i].id
				break;
			} 
		}
		var that = this;
		that.setData({
			packet:packet,
			zhifu:1,
			hongbaoli:hongbaoli,
			payprice:(parseFloat(edata.handle_price)-parseFloat(packet)).toFixed(2)
		})
	},
	hbxz:function(e) {
		var that = this;
		var index = e.currentTarget.dataset.index;
		if (jprice>=hongbaoli[index].rule) {
			for (var i = 0; i<hongbaoli.length;i++) {
				hongbaoli[i].isxx=0;
			}
			hongbaoli[index].isxx=1;
			packet = hongbaoli[index].price
			packetid = hongbaoli[index].id
			that.setData({
				hongbao:0,
				hongbaoli:hongbaoli,
				packet:packet,
				payprice:(parseFloat(edata.handle_price)-parseFloat(packet)).toFixed(2)
			})
		}else{
			wx.showToast({
			  title: '该红包不符合使用规则！',
			  icon: 'none',
			  duration: 2000
			})
		}
	},
	gopay:function(e) {
		var that = this;
		console.log(edata)
		var formdata = {};
		formdata.packet=packet;
		formdata.packet_id=packetid;
		formdata.oid=edata.id;
		formdata.uid=app.globalData.uid;
		console.log(formdata)
		var group = [];
		for (var j = 0; j < edata.group.length; j++) {
			var jdata = {};
			jdata.gid= edata.group[j].gid
			jdata.rid= edata.group[j].rid
			jdata.num= edata.group[j].num
			group.push(jdata);
		}
		wx.showLoading({
		  title: '提交支付中',
		})
		console.log(group)
		config.requstPost(config.Pay,formdata,function (res) {
			wx.hideLoading();
			console.log(res.data)
			if(res.data){
				var oid = JSON.parse(res.data.id);
				var out_trade_no = res.data.out_trade_no;
				console.log(oid)
				wx.requestPayment({
					'timeStamp':res.data['timeStamp'],
					'nonceStr':res.data['nonceStr'],
					'package':res.data['package'],
					'signType':'MD5',
					'paySign':res.data['paySign'],
					'success':function(res){
						console.log(res);
						config.requstPost(config.order,{
							state:1,
							id:oid,
							packet_id:[packetid],
							out_trade_no:out_trade_no,
							group:group,
							uid:app.globalData.uid
						},function (res) {
							console.log(res);
							wx.showToast({
								title: '支付成功',
								icon: 'success',
								duration: 2000
							})
							that.isselect(index+"");
						})
					},
					'fail':function(res)
					{
//						console.log(res);
						config.requstPost(config.order,{state:2,id:oid},function (res) {
							console.log(res);
							wx.showModal({
							  title: '支付失败',
							  content: '请重新支付！',
							  showCancel:false,
							  success: function(res) {
							  }
							})
						})
					}
				})
			}
		})
	},
	onPullDownRefresh: function(){
		console.log("加载了")
	    wx.stopPullDownRefresh();
	    this.isselect(index+"");
  	}
})
function format(timestamp) {
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate();
	return Y+M+D 
}

