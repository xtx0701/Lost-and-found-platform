// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('communication').add({
    data: {
      discussid: event.discussid,
      discussname: event.discussname,
      disscussimg: event.disscussimg,
      discusstext: event.discusstext,
      disscusstime:event.disscusstime,
      openid:event.openid,
      likePeople:[],
    }
  })
}