// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('seekThing')
    .where(_.or([{
      seekNowThing: db.RegExp({
        regexp: event.name,
        options: 'i',
      })
    },
    {
      seekTitle: db.RegExp({
      regexp: event.name,
      options: 'i',
    })
  }
  ]))
      .get({
        success: function (res) {
          return res
        },
      })
  } catch (e) {
    console.error(e);
  }
}