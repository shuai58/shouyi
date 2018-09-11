function quxiao(staue) {
  if (staue==0) {
  	console.log(111111)
   	wx.navigateBack(); 
 
  } else{
  	
  }
 
}
 
function queding() {
  console.log(2222)
}

module.exports = {
  quxiao: quxiao,
  queding: queding
}