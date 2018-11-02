var config = require('../../../../utils/config.js'); 
const app = getApp()
var multiArray = [];
var multiArray2 = []; 
var multiindex = [0,0]; 
var getdata;
var classid;
var classone;
var ised=0;
var tempFilePaths1 = [];
var tempFilePaths2 = [];
var rules=[];
var goodid;
Page({
  data: {
  	ischeck:true,
		isshow1:1,
		isshow2:1,
		multiArray:[],
		multiIndex: [0, 0]
  },
  onLoad: function (res) {
  	wx.setNavigationBarTitle({
		  title:"商品详情编辑"
		})
  	if (res.goodsid!=undefined) {
  		console.log(res.goodsid)
  		goodid = res.goodsid;
  		ised=1;
  		wx.showLoading({
			  title: '数据加载中',
			})
  	}else{	
			ised=0;
			goodid='';  		
  	}
		multiArray = [];
		multiArray2 = []; 
		multiindex = [0,0]; 
		getdata='';
		classid='';
		classone='';
  	tempFilePaths1 = [];
		tempFilePaths2 = [];
		rules=[];
  	var that = this;
 		config.requstGet(config.goodsClass,{},function (res) {
   		console.log(res.data.data)
   		getdata = res.data.data;
   		multiArray[0]=[];
   		multiArray[1]=[];
   		for (var i=0;i<res.data.data.length;i++) {
   			multiArray[0].push(res.data.data[i].title);
   			multiArray2[i]=[];
   			for (var j=0;j<res.data.data[i].class.length;j++) {
	   			multiArray2[i].push(res.data.data[i].class[j].title);
	   		}
   		}
   		classone = res.data.data[0].id;
   		classid = res.data.data[0].class[0].id;
   		console.log(classid+"classid")
   		console.log(classone+"classone")
   		multiArray[1]=multiArray2[0]
   		console.log(multiArray2)
			that.setData({
				multiArray:multiArray
			}); 
			if (ised==1) {
	 			config.requstGet(config.getDetails,{gid:goodid},function (res) {
	 				wx.hideLoading();
	 				console.log("==============")
	 				console.log(res.data.data)
	 				console.log("==============")
	 				for (var i=0;i<res.data.data.banner.length;i++) {
		   			tempFilePaths1.push(config.baseUrl+res.data.data.banner[i]);
		   		} 
		   		for (var i=0;i<res.data.data.details.images.length;i++) {
		   			tempFilePaths2[i]=config.baseUrl+res.data.data.details.images[i];
		   		} 
		   		
		   		for (var i=0;i<res.data.data.details.images.length;i++) {
		   			tempFilePaths2[i]=config.baseUrl+res.data.data.details.images[i];
		   		}  
		   		rules = res.data.data.rules;
		   		for (var i=0;i<rules.length;i++) {
		   			rules[i].rule_image=(config.baseUrl+rules[i].rule_image);
		   		} 
		   		classone = res.data.data.class_one;
		   		classid = res.data.data.class_id;
		   		console.log(classid+"----")
		   		console.log(res.data.data.class_id+"=====")
		   		for (var i=0;i<getdata.length;i++) {
		   			for (var j=0;j<getdata[i].class.length;j++) {
			   			if(res.data.data.class_id==getdata[i].class[j].id){
			   				multiindex[0]=i;
			   				multiindex[1]=j;
			   				multiArray[1]=multiArray2[i];
			   				that.setData({
									multiArray:multiArray,
									multiIndex: multiindex
								});  
			   			}
			   		}
		   		}
		   		that.setData({
		   			name:res.data.data.name,
		   			price:res.data.data.price,
		   			sale_price:res.data.data.sale_price,
		   			share_price:res.data.data.share_price,
		   			share_rules:res.data.data.share_rules,
		   			guigedata:rules,
		   			content:res.data.data.details.content,
		   			tempFilePaths1:tempFilePaths1,
						tempFilePaths2:tempFilePaths2
					}); 
	 			})
	 		}
			
	  })
 		
	},
	bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(multiArray[0][e.detail.value[0]])
    console.log(multiArray[1][e.detail.value[1]])
    for (var i=0;i<getdata.length;i++) {
			if(getdata[i].title==multiArray[0][e.detail.value[0]]){
				for (var j=0;j<getdata[i].class.length;j++) {
	   			if(getdata[i].class[j].title==multiArray[1][e.detail.value[1]]){
	   				classid = getdata[i].class[j].id;
	   				classone = getdata[i].id
	   				console.log(classid+"classid")
	   				console.log(classone+"classone")
	   			}
	   		}
			}
		}
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var that = this;
    if (e.detail.column ==0) {
   		multiArray[1]=multiArray2[e.detail.value];
   		multiindex[0]=e.detail.value;
   		multiindex[1]=0;
    }else if (e.detail.column ==1) {
   		multiindex[1]=e.detail.value;
    } 
    that.setData({
			multiArray:multiArray,
			multiIndex: multiindex
		});  
  },
	switchChange:function(e){
		var that = this;
		console.log(e.detail.value)
		that.setData({
			ischeck:e.detail.value
		})
	},
  uploadImage:function(e){
		var that=this;
		if (e.currentTarget.dataset.type==1||e.currentTarget.dataset.type==2) {
			var len =9
		} else{
			var len =1;
		}
		wx.chooseImage({
	    count: len,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success:function(res){
	    	console.log(res.tempFilePaths)
	    	if (e.currentTarget.dataset.type==1) {
	    		console.log("==11===")
					for(var i=0;i<res.tempFilePaths.length;i++){
		    		tempFilePaths1.push(res.tempFilePaths[i]);
		    	}
					if(tempFilePaths1.length>8){
		    		that.setData({
							 isshow1:0
						})	
		    	}
		    	that.setData({
						tempFilePaths1:tempFilePaths1
					})		
				} else if (e.currentTarget.dataset.type==2){
					console.log("==222===")
					for(var i=0;i<res.tempFilePaths.length;i++){
		    		tempFilePaths2.push(res.tempFilePaths[i]);
		    	}
		    	if(tempFilePaths2.length>8){
		    		that.setData({
							 isshow2:0
						})	
		    	}
		    	that.setData({
						tempFilePaths2:tempFilePaths2
					})	
				} 
	    } 
		});
	}, 
	deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    if (e.currentTarget.dataset.type==1) {
    	tempFilePaths1.splice(index, 1);    
	    this.setData({
	      tempFilePaths1: tempFilePaths1
	    });
	    console.log(tempFilePaths1)
	    if(tempFilePaths1.length<9){
				this.setData({
					 isshow1:1
				})	
			}
    }else if (e.currentTarget.dataset.type==2){
    	tempFilePaths2.splice(index, 1);    
	    this.setData({
	      tempFilePaths2: tempFilePaths2
	    });
	    console.log(tempFilePaths2)
	    if(tempFilePaths2.length<9){
				this.setData({
					 isshow2:1
				})	
			}
    } 
	},
	imgYu:function(e){
		var src = e.currentTarget.dataset.src;//获取data-src
		//图片预览
		wx.previewImage({
			current: src,
			urls: e.currentTarget.dataset.yu // 需要预览的图片http链接列表
		})
	},
	addggbtn: function() {
		var guigedata = {
			rule_image: '/img/S-fatu.png',
			r_price: '',
			title: '',
			r_num:''
		}
		rules.push(guigedata);
		this.setData({
			guigedata:rules
		});
		console.log(rules)
	},
	delgg: function(e) {
 		var index = e.currentTarget.dataset.index;
		rules.splice(index, 1); 
		this.setData({
			guigedata:rules
		});
		console.log(rules)
	},
	edprice: function(e) {
 		var index = e.currentTarget.dataset.index;
		rules[index].r_price=e.detail.value; 
		this.setData({
			guigedata:rules
		});
	},
	edguige: function(e) {
 		var index = e.currentTarget.dataset.index;
		rules[index].title=e.detail.value; 
		this.setData({
			guigedata:rules
		});
	},
	ednum: function(e) {
 		var index = e.currentTarget.dataset.index;
		rules[index].r_num=e.detail.value; 
		this.setData({
			guigedata:rules
		});
	},
	edimg: function(e) {
		var that = this;
 		var index = e.currentTarget.dataset.index;
		wx.chooseImage({
	    count: 1,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success:function(res){
	    	console.log(res.tempFilePaths)
	    	rules[index].rule_image=res.tempFilePaths[0]; 
	    	that.setData({
					guigedata:rules
				});
				console.log(rules)
	    }	 
		});
	},
	savePersonInfo: function(e) {
		var that = this;
		var data = e.detail.value;
		data.class_id = classid;
		data.class_one =classone;
		data.banner = tempFilePaths1;
		data.uid = app.globalData.uid;
		data.shop_id = app.globalData.shop_id;
		data.details = {
			content:e.detail.value.content,
			images:tempFilePaths2
		};
		data.rules = that.data.guigedata;
		console.log(data.rules)
		if(data.rules != undefined){
			for (var i=0; i<data.rules.length;i++) {
				console.log(data.rules[i])
				console.log(trim(data.rules[i].title))
				console.log(trim(data.rules[i].r_price))
				console.log(trim(data.rules[i].rule_image))
				console.log("===========")
				console.log(data.rules[i].r_num)
				console.log(trim(data.rules[i].r_num.toString()))
				console.log("===========")
				if (trim(data.rules[i].title)==''||trim(data.rules[i].r_num.toString())==''||trim(data.rules[i].r_price)==''||trim(data.rules[i].rule_image)=='/img/S-fatu.png') {
					wx.showToast({
					  title: '请完善，规格信息！',
					  icon: 'none',
					  duration: 2000
					})
					return;
				} 
			}
		}
		console.log(data) 
   		var telRule = /^1[3|4|5|7|8]\d{9}$/,
			nameRule = /^[\u2E80-\u9FFF]+$/
		if(data.name == '') {
			wx.showToast({
			  title: '请输入商品名',
			  icon: 'none',
			  duration: 2000
			})
		} else if(data.price == '') {
			wx.showToast({
			  title: '请输入商品原价',
			  icon: 'none',
			  duration: 2000
			}) 
		} else if(data.sale_price == '') {
			wx.showToast({
			  title: '请输入商品现价',
			  icon: 'none',
			  duration: 2000
			})
		} else if(tempFilePaths1.length == 0) {
			wx.showToast({
			  title: '请上传商品轮播图',
			  icon: 'none',
			  duration: 2000
			})
		} else if(data.rules == undefined) {
			wx.showToast({
			  title: '请添加上商品规格',
			  icon: 'none',
			  duration: 2000
			})
		} else if(data.details.images.length<=0) {
			wx.showToast({
			  title: '请上传商品详情图片',
			  icon: 'none',
			  duration: 2000
			})
		} else {
			console.log(data)
			wx.showLoading({
			  title: '数据提交中'
			})
			if (ised==0) {
				var banner = [];
				config.upImg(tempFilePaths1.length,config.upload,tempFilePaths1,banner,function () {
					console.log(banner)
					data.banner = banner;
					upguige(data.rules.length,data.rules,function (res) {
						console.log(res)
						var xiangqing = [];
						config.upImg(tempFilePaths2.length,config.upload,tempFilePaths2,xiangqing,function () {
							console.log(xiangqing)
							data.details.images = xiangqing;
							console.log(data) 
							config.requstPost(config.putGood, data, function(res) {
								console.log(res)
								wx.hideLoading();
								if(res.data.code==0){
									wx.showToast({
									  title: '提交成功',
									  icon: 'success',
									  duration: 2000
									})
									setTimeout(function(){   
										wx.navigateBack();
									},2000);
								}else{
									wx.showModal({
									  title: '提交失败',
									  content: '请从新提交！',
									  success: function(res) {
									    wx.navigateBack();
									  }
									})
								}
							})  
						})
					})
				})
			} else{
				updataurl(tempFilePaths1.length,tempFilePaths1,function () {
					console.log(tempFilePaths1);
					data.banner = tempFilePaths1;
					updataurl(tempFilePaths2.length,tempFilePaths2,function () {
						console.log(tempFilePaths2);
						data.details.images = tempFilePaths2;
						upguige(data.rules.length,data.rules,function (res) {
							console.log(res);
							console.log(data);
							data.id=goodid;
							config.requstPost(config.putShopGoodsE, data, function(res) {
								console.log(res)
								wx.hideLoading();
								if(res.data.code==0){
									wx.showToast({
									  title: '提交成功',
									  icon: 'success',
									  duration: 2000
									})
									setTimeout(function(){   
										wx.navigateBack();
									},2000);
								}else{
									wx.showModal({
									  title: '提交失败',
									  content: '请从新提交！',
									  success: function(res) {
									    wx.navigateBack();
									  }
									})
								}
							})   
						})
					})
				})
			}
				
		}
	}
})
function upguige(i,temp,callback){
	i--;
	if(temp[i].rule_image.indexOf(config.baseUrl) < 0){
	  config.upImgone(config.upload,temp[i].rule_image,function (res) {
	  	temp[i].rule_image = res;
	  	console.log(temp[i].rule_image+"++++++++++");
	  	if(i==0){
				callback(temp) 
			}else{
				upguige(i,temp,callback)
			}
	  })
	}else{
		temp[i].rule_image = temp[i].rule_image.replace(config.baseUrl, '');
		console.log(temp[i].rule_image+"----");
		if(i==0){
			callback(temp) 
		}else{
			upguige(i,temp,callback)
		}
	} 
}
function updataurl(i,temp,callback){
	i--;
	if(temp[i].indexOf(config.baseUrl) < 0){
	  config.upImgone(config.upload,temp[i],function (res) {
	  	temp[i] = res;
	  	console.log(temp[i]+"++++++++++");
	  	if(i==0){
				callback(temp) 
			}else{
				updataurl(i,temp,callback)
			}
	  })
	}else{
		temp[i] = temp[i].replace(config.baseUrl, '');
		console.log(temp[i]+"----");
		if(i==0){
			callback(temp) 
		}else{
			updataurl(i,temp,callback)
		}
	}
 
}
function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

