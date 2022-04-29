// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { _id, saveList, nickName, avaterUrl } = event;
    return await db.collection('communitysave')
      .doc(_id)
      .update({
        data: {
          nickName,
          avaterUrl,
          saveList
        },
        success: function (res) {
          return res
        }
      })
  } catch (e) {
    console.error(e);
  }
}