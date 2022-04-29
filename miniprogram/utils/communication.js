function adddisscuss(data, callback) {  //这里要两个参，多一个id
  wx.cloud.callFunction({
    name: "add_disscuss",
    data: data,
    success(res) {
      callback && callback(res.result)
    },
    fail(res) {
    }
  })

}

function update_discuss_reply(id,reply_data,callback){
  wx.cloud.callFunction({
    name:"update_communication",
    data:{
      id:id,
      data:reply_data
    },
    success(res){
      callback && callback(res.result)
    },
    fail(res){}
  })
}

function deletCommunication(id,callback){
  wx.cloud.callFunction({
    name:"delet_communication",
    data:{
      id:id,
    },
    success(res){
      callback && callback(res.result)
      console.log(res)
    },
    fail(res){}
  })
}

function updateCommunication(id,value,callback) {
  wx.cloud.callFunction({
    name: 'update_communication_likepeople',
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

module.exports = {
  adddisscuss: adddisscuss,
  update_discuss_reply:update_discuss_reply,
  deletCommunication:deletCommunication,
  updateCommunication:updateCommunication
}