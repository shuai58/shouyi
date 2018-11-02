var baseUrl = 'https://dt.huanqiushengao.cn';
module.exports = {
  key: "4MIBZ-JS3LI-RCVGD-5F4VH-OGGPE-W7BOJ",
  userinform:userinform,
  baseUrl:baseUrl,
  requstGet: requstGetData,
  requstPost: requstPostData,
  upImg: upImg,
  upImgone:upImgone,
  getCart: baseUrl + '/api/order/getCart',//1.获取购物车信息
  orderEdit: baseUrl + '/api/order/putEdit',//2.购物车修改数量
  onLogin: baseUrl + '/user/Oauth/onLogin',//3.用户登录权限获取
  userInfo: baseUrl + '/user/Oauth/userInfo',//4.获取用户信息
  getClass: baseUrl + '/api/show/getClass',//5.首页分类导航api/my/putAdder
  putAdder: baseUrl + '/api/my/putAdder',//6.添加收货地址
  getAdder: baseUrl + '/api/my/getAdder',//7.获取用户的收货地址
  putChoose: baseUrl + '/api/my/putChoose',//8.设置默认收货地址
  delAdder: baseUrl + '/api/my/delAdder',//9.删除收货地址
  putEdit: baseUrl + '/api/my/putEdit',//10.修改收货地址
  putSki: baseUrl + '/api/Inski/putSki',//11.手艺人入驻
  upload: baseUrl + '/api/shops/upload',//12.图片上传接口
  putShop: baseUrl + '/api/shops/putShop',//13.开店提交
  getVerdict: baseUrl + '/api/Inski/getVerdict',//14.判断用户手艺人开店通过状态
  putSkiE: baseUrl + '/api/Inski/putSkiE',//15.手艺人信息修改
  getSki: baseUrl + '/api/my/getSki',//16.手艺人信息
  getshopVerdict: baseUrl + '/api/Shops/getVerdict',//17.判断用户开店通过状态
  getShop: baseUrl + '/api/my/getShop',//18.获取商铺信息
  putEshop: baseUrl + '/api/Shops/putEshop',//19.修改商家信息
  goodsClass: baseUrl + '/api/goods/getClass',//20.获取分类
  putGood: baseUrl + '/api/goods/putGood',//21.添加商品 
  getDetails: baseUrl + '/api/goods/getDetails',//22.获取商品详情 
  putShopGoodsE: baseUrl + '/api/goods/putShopGoodsE',//23.修改商品信息
  getShopGoods: baseUrl + '/api/goods/getShopGoods',//24.获取商家上传商品 
  putAway: baseUrl + '/api/goods/putAway',//25.商品上架、下架
  putDel: baseUrl + '/api/goods/putDel',//26.删除商品
  showSki: baseUrl + '/api/show/getSki',//27.手艺人首页
  skiShop: baseUrl + '/api/Inski/skiShop',//28.手艺人店铺
  getGoods: baseUrl + '/api/goods/getGoods',//29.根据二级分类获取商品
	getGoodsReply: baseUrl + '/api/goods/getGoodsReply',//30.获取商品的评价
	putCart: baseUrl + '/api/order/putCart',//31.加入购物车
	getOgoods: baseUrl + '/api/Goods/getOgoods',//32.根据一级分类获取商品
	circleList: baseUrl + '/api/circle/getList',//33.手艺圈帖子列表
	publish: baseUrl + '/api/circle/publish',//34.发布帖子
	circleLike: baseUrl + '/api/circle/like',//35.点赞，取消点赞
	reply: baseUrl + '/api/circle/reply',//36.回复帖子
	getRules: baseUrl + '/api/circle/getRules',//37.发布置顶规则 
	myissue: baseUrl + '/api/circle/myissue',//38.我的发布 
	delete: baseUrl + '/api/circle/delete',//39.删除帖子
	refresh: baseUrl + '/api/circle/refresh',//40.刷新帖子
	createOrder: baseUrl + '/api/circle/createOrder',//41。置顶获取微信支付签名
	getBanner: baseUrl + '/api/goods/getBanner',//42.轮播图
	seekGoods: baseUrl + '/api/goods/seekGoods',//43.搜索
	cartDel: baseUrl + '/api/order/cartDel',//44.删除购物车信息
	putFeedback: baseUrl + '/api/my/putFeedback',//45.意见反馈
	shopsProtocol: baseUrl + '/api/shops/getProtocol',//46.获取开店入驻协议
	inskiProtocol: baseUrl + '/api/Inski/getProtocol',//47.获取手艺人入驻协议
	getAbout: baseUrl + '/api/My/getAbout',//48.关于我们
	getRelation: baseUrl + '/api/My/getRelation',//49.联系我们
	getSplit: baseUrl + '/api/Packet/getSplit',//50.判断登录人是否拆过红包
	getmyadd: baseUrl + '/api/my/getadd',//51.获取默认地址
	getPacke: baseUrl + '/api/Packet/getPacke',//52.获取该用户的所有红包
	getCourier: baseUrl + '/api/shops/getCourier/getCourier',//53.查看快递价格及使用规则
	Pay: baseUrl + '/user/order/Pay',//54.支付以及生成订单
	order: baseUrl + '/user/order/index',//55.支付状态改变
	putCourier: baseUrl + '/api/shops/putCourier',//56.设置快递价格及其使用规则
	editCourier: baseUrl + '/api/shops/editCourier',//57.修改快递的价格
	getOrder: baseUrl + '/api/order/getOrder',//58.我的订单
	shopsOrder: baseUrl + '/api/shops/getOrder',//59.商家订单
	orderDateils: baseUrl + '/api/order/orderDateils',//60.订单详情
	putCnumber: baseUrl + '/api/order/putCnumber',//61.填写物流信息发货
	expInfo: baseUrl + '/api/express/expInfo',//62.查看物流
	getCause: baseUrl + '/api/shops/getCause',//63.查看退货原因
	refunds: baseUrl + '/user/order/refunds',//64.同意退货或者拒绝退货
	putEvaluate: baseUrl + '/api/order/putEvaluate',//65.订单查看评价
	delOrderRecord: baseUrl + '/api/order/delOrderRecord',//66.删除订单记录
	delOrder: baseUrl + '/api/order/delOrder',//67.删除未支付订单
	putRecall: baseUrl + '/api/order/putRecall',//68.撤回退货
	putAffirm: baseUrl + '/api/order/putAffirm',//69.确认收货
	refund: baseUrl + '/api/order/refund',//70.申请退款
	putDiscuss: baseUrl + '/api/order/putDiscuss',//71.评价商品
	putCartDefault: baseUrl + '/api/order/putCartDefault',//72.直接点击加入购物车默认规则
	putGenerate: baseUrl + '/api/Packet/putGenerate',//73.抢红包
	putPoints: baseUrl + '/api/Packet/putPoints',//74.邀请进来分红包
	drawMoney: baseUrl + '/api/shops/drawMoney',//75.提现申请
	moneyRecords: baseUrl + '/api/shops/moneyRecords',//76.提现记录
	money: baseUrl + '/api/shops/money',//77.商家金额核算
	
	lookIphone: baseUrl + '/api/inski/lookIphone',//78.判断查看电话
	examine: baseUrl + '/user/order/examine',//79.查看电话支付
	examines: baseUrl + '/user/order/examines',//80.支付成功 放弃支付访问接口 
}

// GET 请求
function requstGetData(url, param,callback) {
    var joiningUrl = url+'?'
    for (var key in param){
     joiningUrl =  joiningUrl+key+'='+param[key]+'&'
    }
    console.log(joiningUrl)
     var that = this
    wx.request({
        url: url,
        data: param,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            callback(res)
        },
        fail: function (res) {
            callback(res) 
        }
    })
}

// POST 请求
function requstPostData(url, param,callback) {
	console.log(url)
    wx.request({
        url: url,
        data: param,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            callback(res)
        },
        fail: function (res) {
            callback(res) 
        }
    })
}
//获取用户信息
function userinform(that,app) {
	if (app.globalData.userInfo) {
		return app.globalData.userInfo;
	} else if (that.data.canIUse){
	  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
	  // 所以此处加入 callback 以防止这种情况
		app.userInfoReadyCallback = res => {
		    return res.userInfo;
		}
	} else {
	  // 在没有 open-type=getUserInfo 版本的兼容处理
	  wx.getUserInfo({
	    success: res => {
	      app.globalData.userInfo = res.userInfo
	      return res.userInfo;
	    }
	  })
	}
}
function upImg(i,upurl,updata,imgdata,callback){
	i--;
	wx.uploadFile({ 
	  url:upurl,
	  header:{"Content-type" : "multipart/form-data"},
	  filePath:updata[i],
	  name: 'image',
	  success: function(res){ 
	  	console.log(res)
 			var html = res.data.replace(/^\"|\"$/g,'').replace(/[\\]/g,'');
	  	imgdata.push(html)
	  	if(i==0){
				callback(imgdata) 
	  	}else{
	  		upImg(i,upurl,updata,imgdata,callback)
	  	}
	  }
	})
}
function upImgone(upurl,updata,callback){
	wx.uploadFile({ 
	  url:upurl,
	  header:{"Content-type" : "multipart/form-data"},
	  filePath:updata,
	  name: 'image',
	  success: function(res){ 
	  	console.log(res)
 			var imgdata = res.data.replace(/^\"|\"$/g,'').replace(/[\\]/g,'');
	  	callback(imgdata) 
	  }
	})
}