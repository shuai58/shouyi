var config = require('../../utils/config.js'); 
const app = getApp()
Page({
  data: {
		 addresslist:[]
  },
  onShow: function (res) {
  	wx.setNavigationBarTitle({
		  title:"收货地址"
		})
  	var that = this;
  	config.requstGet(config.getAdder,{uid:app.globalData.uid},function (res) {
   		console.log(res.data)
   		if (res.data.code==0) {
   			that.setData({
					addresslist: res.data.data 
				}); 
   		}
	  }) 	 
  	
  },
  putChoose:function (e) {
  	var that = this; 
  	console.log(e.currentTarget.dataset)
  	var addresslist = that.data.addresslist;
  	config.requstGet(config.putChoose,{uid:app.globalData.uid,id:e.currentTarget.dataset.id},function (res) {
   		console.log(res.data.code)
   		if(res.data.code==0) {
   			for (var i = 0; i<addresslist.length;i++) {
   				if (i==e.currentTarget.dataset.index) {
   					addresslist[i].statu=1
   				} else{
   					addresslist[i].statu=0
   				}
   			}
   		} 
			that.setData({
				addresslist: addresslist
			}); 
	  }) 	 
  },
  delclick(e){
  	var that = this; 
  	console.log(e.currentTarget.dataset)
  	var addresslist = that.data.addresslist;
  	config.requstGet(config.delAdder,{id:e.currentTarget.dataset.id},function (res) {
   		console.log(res.data)
   		if(res.data.code==0) {
   			for (var i = 0; i<addresslist.length;i++) {
   				if (addresslist[i].id==e.currentTarget.dataset.id) {
   					addresslist.splice(i,1);
						that.setData({
							addresslist: addresslist
						}); 
   					return;
   				} 
   			}
   		} 	
	  }) 	
  },
  putEdit(e){
  	var that = this; 
//	console.log(e.currentTarget.dataset)
  	var addresslist = that.data.addresslist;
		var deldata;
		for (var i = 0; i<addresslist.length;i++) {
			if (addresslist[i].id==e.currentTarget.dataset.id) {
  			deldata=addresslist[i];
			} 
		}
		deldata = JSON.stringify(deldata);
//		console.log(deldata)
 		wx.navigateTo({
			url: `/pages/address/editaddress/editaddress?deldata=`+ deldata
		})
  }
})

