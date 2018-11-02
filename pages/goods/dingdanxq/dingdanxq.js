var config = require('../../../utils/config.js'); 
var app = getApp();
var showdata=null;
var datalist = [];
var hongbaolist = [];
var packet=0;
var packetid='';
var urldata=null;
var hejiprice = 0;
var hejiprice2 =0;
Page({
  data: {
		 hongbao:0 
  },
  onShow: function () {
  	var that = this;
	config.requstGet(config.getmyadd,{uid:app.globalData.uid},function (res) {
	console.log(res.data.data)
	if (res.data.code==0) {
		that.setData({
			address:res.data.data
		})
	}  	
	}) 
	that.setData({
		address:{}
	})
  },
  onLoad: function(res) {
  	wx.setNavigationBarTitle({
	  title:"订单"
	})
  	packet=0;
  	packetid="";
  	var that = this;
		showdata = JSON.parse(res.urldata); 
		hejiprice = 0;
		hejiprice2 =0;
		hongbaolist = [{shop_id:0,list:[]}];
		for (var i=0;i<showdata.length;i++) {
			var mynum = 0;
			var myprice = 0;
			showdata[i].shop_img = config.baseUrl+showdata[i].shop_img;
			for (var j=0;j<showdata[i].group.length;j++) {
				showdata[i].group[j].image = config.baseUrl+showdata[i].group[j].image;
				mynum += showdata[i].group[j].num;
				myprice = (parseFloat(myprice) +showdata[i].group[j].num*showdata[i].group[j].unit_price).toFixed(2)
			}
			showdata[i].handle_price = myprice;
			showdata[i].gong_num = mynum;
			hejiprice =(parseFloat(hejiprice) + parseFloat(myprice)).toFixed(2);
			hongbaolist.push({shop_id:showdata[i].shop_id,list:[]});
		}
		hejiprice2 = hejiprice;
		urldata = showdata;
		console.log(showdata)
		cprice(showdata.length,showdata,function () {
			config.requstGet(config.getPacke,{uid:app.globalData.uid},function (res) {
	   		if(res.data.code==0) {
	   			var hbdata = res.data.data;
	   			for (var i = 0; i<hbdata.length;i++) {
						hbdata[i].overtime=format(hbdata[i].overtime)
	   				for (var j = 0; j<hongbaolist.length;j++) {
	   					if (hbdata[i].shop_id==hongbaolist[j].shop_id) {
		   					hongbaolist[j].list.push(hbdata[i]);
		   					if (hongbaolist[j].list.length>0) {
									for (var k = 0; k<hongbaolist[j].list.length;k++) {
										hongbaolist[j].list[k].isxx=0	
									}
		   					} 
		   				} 
	   				}	
	   			}
	   			for (var i = 0; i<showdata.length;i++) {
						for (var j = 0; j<hongbaolist.length;j++) {
							if (hongbaolist[j].shop_id==showdata[i].shop_id) {
								if (hongbaolist[j].list.length>0) {
									for (var k = 0; k<hongbaolist[j].list.length;k++) {
										if (showdata[i].handle_price>=hongbaolist[j].list[k].rule) {
											hongbaolist[j].list[k].isxx=1;
											showdata[i].s_packet = hongbaolist[j].list[k].price
											showdata[i].s_packet_id = hongbaolist[j].list[k].id
											break;
										}
									}
								} 
			   			} 
						}	
					}
	   		} 
	   		if (hongbaolist[0].list.length>0) {
	   			for (var k = 0; k<hongbaolist[0].list.length;k++) {
						if (hejiprice>=hongbaolist[0].list[k].rule) {
							hongbaolist[0].list[k].isxx=1;
							packet = hongbaolist[0].list[k].price
							packetid = hongbaolist[0].list[k].id
							break;
						}
					}
	   		} 
	   		that.setData({
					datalist:showdata,
					hejiprice:hejiprice,
					packet:packet
				})
	   		that.heji();
		  })  
		})
		that.setData({
			datalist:showdata,
			hejiprice:hejiprice
		})
  },
  getkeyword: function(e) {
		for (var i = 0; i < showdata.length; i++) {
			if (showdata[i].shop_id==e.currentTarget.dataset.shopid) {
				showdata[i].message=e.detail.value;
				break;
			} 
		}
		console.log(showdata)
	},
	close:function(e) {
		this.setData({
			hongbao:0 
		})
	},
	hongbao:function(e) {
		console.log(e.currentTarget.dataset.shopid)
		var hongbaoli = [];
		for (var i = 0; i<hongbaolist.length;i++) {
			if (hongbaolist[i].shop_id==e.currentTarget.dataset.shopid) {
				hongbaoli = hongbaolist[i].list;
				console.log(hongbaoli)
				break;
			} 
		}
		this.setData({
			hongbao:1,
			hongbaoli:hongbaoli
		})
	},
	hbxz:function(e) {
		var that = this;
		var index = e.currentTarget.dataset.index;
		var shopid = e.currentTarget.dataset.shopid;
		var hbitem = that.data.hongbaoli;
		if (e.currentTarget.dataset.shopid==0) {
			if (hejiprice>=hbitem[index].rule) {
				for (var i = 0; i<hbitem.length;i++) {
					hbitem[i].isxx=0;
					hongbaolist[0].list[i].isxx=0;
				}
				hongbaolist[0].list[index].isxx=1;
				hbitem[index].isxx=1;
				packet = hbitem[index].price
				packetid = hbitem[index].id
//				console.log(hongbaolist[0].list)
				that.setData({
					hongbao:0,
					hongbaoli:hbitem,
					packet:packet
				})
				that.heji();
			}else{
				wx.showToast({
				  title: '该红包不符合使用规则！',
				  icon: 'none',
				  duration: 2000
				})
			}
		}else{
			for (var i = 0; i<urldata.length;i++) {
				if(urldata[i].shop_id==e.currentTarget.dataset.shopid) {
				 	if (urldata[i].handle_price>=hbitem[index].rule) {	
						for (var k = 0;k<hongbaolist.length;k++) {
							if (hongbaolist[k].shop_id==e.currentTarget.dataset.shopid) {
								for (var j = 0;j<hbitem.length;j++) {
									hbitem[j].isxx=0;
									hongbaolist[k].list[j].isxx=0;
								}
								hongbaolist[k].list[index].isxx=1;
								hbitem[index].isxx=1;
								showdata[i].s_packet = hbitem[index].price
								showdata[i].s_packet_id = hbitem[index].id
							}
						}
						that.setData({
							hongbao:0,
							datalist:showdata,
							hongbaoli:hbitem,
							packet:packet
						})
						that.heji();
					}else{
						wx.showToast({
						  title: '该红包不符合使用规则！',
						  icon: 'none',
						  duration: 2000
						})
					}
				}
			}		
		}
	},
	heji:function () {
		var that = this;
		console.log(showdata)
		var jiage = 0;
		for (var i = 0; i < showdata.length; i++) {
			var handle_price = 0;
			if (showdata[i].s_packet!=undefined) {
				handle_price =parseFloat(-showdata[i].s_packet)
			}
			var pr = 0;
			for (var j = 0; j < showdata[i].group.length; j++) {
				 pr = (parseFloat(pr) + parseFloat(showdata[i].group[j].unit_price)*showdata[i].group[j].num).toFixed(2)
			}
			handle_price =(parseFloat(handle_price)+parseFloat(showdata[i].c_price)+parseFloat(pr)).toFixed(2);
			showdata[i].handle_price = handle_price;
			jiage = (parseFloat(jiage)+parseFloat(showdata[i].handle_price)).toFixed(2);
		}
		jiage = (jiage-parseFloat(packet)).toFixed(2);
		that.setData({
			datalist:showdata,
			hejiprice:jiage
		})
	},
	tijiao:function () {
		var that = this;
		console.log(that.data.address.people)
		if(that.data.address.people==undefined){
			wx.showModal({
			  title: '提示',
			  content: '请先添加收货地址！',
			  showCancel:false,
			  success: function(res) {
			    wx.navigateTo({
					  url: `/pages/address/address`
					})
			  }
			})
		}else{
			console.log(showdata)
			var group = [];
			var hbid = [];
			for (var i = 0; i < showdata.length; i++) {
				showdata[i].shop_img = showdata[i].shop_img.replace(config.baseUrl, '')
				for (var j = 0; j < showdata[i].group.length; j++) {
					showdata[i].group[j].image = showdata[i].group[j].image.replace(config.baseUrl, '');
					var jdata = {};
					jdata.gid= showdata[i].group[j].gid
					jdata.rid= showdata[i].group[j].rid
					jdata.num= showdata[i].group[j].num
					group.push(jdata);
				}
				if (showdata[i].s_packet_id!=undefined) {
					hbid.push(showdata[i].s_packet_id)
				}
			}
			console.log(group)
			var formdata = {};
			formdata.uid = app.globalData.uid;
			formdata.total_fee=0.01;//that.data.hejiprice;
			formdata.people=that.data.address.people;
			formdata.iphone=that.data.address.iphone;
			formdata.province=that.data.address.adder.province;
			formdata.city=that.data.address.adder.city;
			formdata.county=that.data.address.adder.county;
			formdata.detail=that.data.address.adder.detail;
			formdata.packet=packet;
			formdata.packet_id=packetid;
			formdata.data=JSON.stringify(showdata)
			console.log(formdata)
			hbid.push(packetid)
			console.log(hbid)
			config.requstPost(config.Pay,formdata,function (res) {
				console.log(res)
				if(res.data){
					if (res.data.data=="商品数量不足") {
						wx.showModal({
						  title: '友情提示',
						  content: '商品数量不足！请重新选择商品！',
						  showCancel:false,
						  success: function(res) {
						  	wx.navigateBack();
						  }
						})
						return;
					} 
					var out_trade_no = res.data.out_trade_no;
					var oid = res.data['id'];
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
								packet_id:hbid,
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
								setTimeout(function() {
									wx.navigateBack();
								}, 2000);
							})
						},
						'fail':function(res)
						{
							console.log(res);
							config.requstPost(config.order,{state:2,id:oid},function (res) {
								console.log(res);
								wx.showModal({
								  title: '支付失败',
								  content: '可在我的订单待付款中继续支付！',
								  showCancel:false,
								  success: function(res) {
								     wx.navigateBack();
								  }
								})
							})
						}
					})
				}
			}) 
		}
	}
})
function cprice(i,sdata,callback){
	i--;
	config.requstGet(config.getCourier,{shop_id:sdata[i].shop_id},function (res) {
		if(res.data.code==0){
			if (res.data.data.rules!=undefined&&res.data.data.rules!="") {
				if (sdata[i].handle_price>=res.data.data.rules) {
					sdata[i].c_price=0
				} else{
					sdata[i].c_price=res.data.data.c_price
				}
			} else{
				sdata[i].c_price=res.data.data.c_price
			}
			
		}
		if(i==0){
			callback() 
  	}else{
  		cprice(i,sdata,callback)
  	}
  }) 
}
function format(timestamp) {
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate();
	return Y+M+D 
}
