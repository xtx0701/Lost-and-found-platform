// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var id = event.id
  try {
    return await db.collection('community').doc(id).get({
      success: function (res) {
        return res
      }
    })
  } catch (e) {
    return e;
  }
}