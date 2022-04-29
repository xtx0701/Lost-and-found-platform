// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})
var $ = cloud.database().command.aggregate
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('community').aggregate()
  .lookup({
    from:"user", 
    localField: 'openid', 
    foreignField: '_openid', 
    as: 'newcommunity' 
  })
  .replaceRoot({  
    newRoot: $.mergeObjects([$.arrayElemAt(['$newcommunity', 0]), '$$ROOT'])
  })
  .project({
    newcommunity: 0
  })
  .end({
    success:function(res){
      return res;
    },
    fail(error) {
      return error;
    }
  })
}