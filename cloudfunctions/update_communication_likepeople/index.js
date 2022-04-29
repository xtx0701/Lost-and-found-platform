// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var _id = event.id
    var value = event.value
    return await db.collection('communication')
      .doc(_id)
      .update({
        data:{
          likePeople:value
        },
        success: function (res) {
          return res
        }
      })
  } catch (e) {
    console.error(e);
  }
}