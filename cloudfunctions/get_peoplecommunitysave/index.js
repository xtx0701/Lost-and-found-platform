// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})
var $ = cloud.database().command.aggregate
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const data = await db.collection('communitysave')
      .aggregate()
      .match({
        openid: wxContext.OPENID
      })
      .lookup({
        from: "community",
        localField: 'saveList',
        foreignField: '_id',
        as: 'uapproval'
      })
      .end()
    return {
      data
    }
  } catch (e) {
    console.error(e);
  }
}