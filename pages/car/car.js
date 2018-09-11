const config = require('../../utils/config.js'); 
var app = getApp();
var carlist = [];
Page({
  	data: {
  		carlist:[],
  		selectAllStatus:0,
  		totalNum:0,
  		totalPrice:0
   	},
  	onShow: function() {
  		wx.setNavigationBarTitle({
		  title:"购物车"
		})
  		carlist = [];
		var that = this;
		config.requstGet(config.getCart,{uid:app.globalData.uid},function (res) {
			console.log(res.data.data)
 			if (res.data.code==0) {
 				carlist = res.data.data;
 				for(var i=0;i<carlist.length;i++){
 					carlist[i].logo = config.baseUrl+carlist[i].logo;
	   				for(var j=0;j<carlist[i].massage.length;j++){
						carlist[i].massage[j].selected = 0;
						carlist[i].massage[j].shop_id = carlist[i].shop_id;
						carlist[i].massage[j].image = config.baseUrl+carlist[i].massage[j].image;
	   				}
	   				carlist[i].goodsnum = 0;
	   				carlist[i].goodsprice = 0;
	   			}
	   			console.log(carlist)
		    	that.setData({
		    		carlist:carlist,
		    		selectAllStatus:0,
		    		totalNum:0,
			  		totalPrice:0
				})
 			}else{
 				that.setData({
		    		carlist:[],
			  		selectAllStatus:0,
			  		totalNum:0,
			  		totalPrice:0
				})
 			}
		})  
	},
	getTotalPrice() {       
	    let total = 0;
	    let totalNum = 0;
	    for(let i = 0; i<carlist.length; i++) { 
	    	carlist[i].goodsnum = 0;
   			carlist[i].goodsprice = 0;
	    	for(var j=0;j<carlist[i].massage.length;j++){
				if(carlist[i].massage[j].selected) {                    
					carlist[i].goodsnum += parseInt(carlist[i].massage[j].num);
   					carlist[i].goodsprice += carlist[i].massage[j].num * carlist[i].massage[j].goods_price;
		            total += carlist[i].massage[j].num * carlist[i].massage[j].goods_price;     
		        }
			}   
			totalNum += carlist[i].goodsnum;
	    }
	    this.setData({
	    	carlist: carlist,
	        totalPrice: total,
	        totalNum:totalNum
	    });
	},
	selectList(e) {
	    const index = e.currentTarget.dataset.index;  
	    const shopid = e.currentTarget.dataset.shopid;  
	    for(let i = 0; i<carlist.length; i++) { 
	    	if(carlist[i].shop_id==shopid) {                    
	            const selected = carlist[i].massage[index].selected;          
		    	carlist[i].massage[index].selected = !selected;  
		    	if (carlist[i].massage[index].selected==0) {
		    		this.setData({
				        selectAllStatus: 0
				    });
		    	} 
	        }
	    } 
	    this.setData({
	        carlist: carlist
	    });
	    this.getTotalPrice();                         
	},
	selectAll(e) {
	    let selectAllStatus = this.data.selectAllStatus;     
	    selectAllStatus = !selectAllStatus;
	    for (let i = 0; i < carlist.length; i++) {
	    	for(var j=0;j<carlist[i].massage.length;j++){
				carlist[i].massage[j].selected = selectAllStatus
			}  
	    }
	    this.setData({
	        selectAllStatus: selectAllStatus,
	        carlist: carlist
	    });
	    this.getTotalPrice();                               
	},
	addCount(e) {
		var that = this;
		const index = e.currentTarget.dataset.index;  
	    const shopid = e.currentTarget.dataset.shopid;  
	    for(let i = 0; i<carlist.length; i++) { 
	    	if(carlist[i].shop_id==shopid) {  
	    		let num = parseInt(carlist[i].massage[index].num);
	    		num = num + 1;
	            config.requstGet(config.orderEdit,{siid:carlist[i].massage[index].id,num:num},function (res) {
		   			console.log(res.data)
	    			if (res.data.code==0) {
		   				carlist[i].massage[index].num = num;  
				    	that.setData({
					      carlist: carlist
					    });
					    that.getTotalPrice();
		   			} 
			    }) 	            
	        }
	    } 
	},
	minusCount(e) {
		var that = this;
	    const index = e.currentTarget.dataset.index;  
	    const shopid = e.currentTarget.dataset.shopid;  
	    for(let i = 0; i<carlist.length; i++) { 
	    	if(carlist[i].shop_id==shopid) {  
	    		let num = parseInt(carlist[i].massage[index].num);
	    		if(num <= 1){
			      return false;
			    }
	    		num = num - 1;
	    		config.requstGet(config.orderEdit,{siid:carlist[i].massage[index].id,num:num},function (res) {
		   			console.log(res.data)
	    			if (res.data.code==0) {
		   				carlist[i].massage[index].num = num;  
				    	that.setData({
					      carlist: carlist
					    });
					    that.getTotalPrice();
		   			} 
			    }) 	     
	        }
	    }   
	},
	deleteList() {
		var that = this;
		var siid = [];
	    for(let i = 0; i<carlist.length; i++) { 
    		for(var j=0;j<carlist[i].massage.length;j++){
				if(carlist[i].massage[j].selected!=0) {    
					siid.push(carlist[i].massage[j].id)
		       }
			}   
	    }
	    if (siid.length<=0) {
			wx.showToast({
				title: '你还没选择商品！',
				icon: 'none',
				duration: 2000 
			})
			return
		}
	    config.requstPost(config.cartDel,{siid:siid},function (res) {
   			console.log(res.data)
			if (res.data.code==0) {
				wx.showToast({
					title: '删除成功！',
					icon: 'success',
					duration: 1000,
					success: function(res) {
						that.onShow();
					}
				})
   			}else{
   				wx.showToast({
					title: '删除失败，请从新删除！',
					icon: 'none',
					duration: 2000 
				})
   			}
		}) 
	},
	jiesuan:function () {
		var urldata = carlist; 
	    for(let i = 0; i<urldata.length; i++) { 
	    	for(var j=0;j<urldata[i].massage.length;j++){
				if(!urldata[i].massage[j].selected) {                    
					urldata[i].massage.splice(j,1); 
					j--;
		        }
			}   
	    }
	    for(let i = 0; i<urldata.length; i++) { 
	    	if(urldata[i].massage.length==0) {                    
				urldata.splice(i,1); 
				i--;
	        }  
	    }
	    console.log(urldata)
		var datalist = [];
		for(let i = 0; i<urldata.length; i++) { 
			datalist[i] = {
				shop_id:urldata[i].shop_id,
				shop_name:urldata[i].shop_name,
				shop_img:urldata[i].logo.replace(config.baseUrl, ''),
				group:[]
			}
			for(var j=0;j<urldata[i].massage.length;j++){
				datalist[i].group[j]={
					gid:urldata[i].massage[j].gid,
					rid:urldata[i].massage[j].rid,
					s_name:urldata[i].massage[j].goods_name,
					image:urldata[i].massage[j].image.replace(config.baseUrl, ''),
					unit_price:urldata[i].massage[j].goods_price,
					num:urldata[i].massage[j].num,
					rule_name:urldata[i].massage[j].rules_name
				}
			}  
		}
		console.log(datalist)
		if (datalist.length<=0) {
			wx.showToast({
				title: '你还没选择商品！',
				icon: 'none',
				duration: 2000 
			})
			this.onShow();
		} else{
			datalist=JSON.stringify(datalist)
			wx.navigateTo({
				url: `/pages/goods/dingdanxq/dingdanxq?urldata=${datalist}` 
			})
		}		
	},
	goodsxq: function(e) {
		wx.navigateTo({
		  url: `/pages/goods/goods?id=`+e.currentTarget.dataset.id
		})
	}
})

