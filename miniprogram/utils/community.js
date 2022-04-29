function getCommunity(callback) {
  wx.cloud.callFunction({
    name: 'get_community',
    success: function (res) {
      callback && callback(res.result)
    },
    fail: console.error
  })
}
function updateCommunity(id,value,callback) {
  wx.cloud.callFunction({
    name: 'update_community',
    data: { 
      id: id,
      value:value 
    },
    success: function (res) {
      callback && callback(res)
    },
    fail: console.error
  })
}
function updateAleadyread(id,value,callback){
  wx.cloud.callFunction({
    name:"update_alreadyread",    //阅读人的openid
    data:{
      id:id,
      value:value
    },
    success(res){
      callback && callback(res.result)
    },
    fail(res){}
  })
}
function deletCommunity(id,callback){
  wx.cloud.callFunction({
    name:"delet_community",
    data:{
      id:id,
    },
    success(res){
      callback && callback(res.result)
      // console.log(res)
    },
    fail(res){}
  })
}
module.exports = {
  getCommunity: getCommunity,
  updateCommunity:updateCommunity,
  updateAleadyread:updateAleadyread,
  deletCommunity:deletCommunity
}