// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xhm-3gaxlhxe5a2219f2',
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  const _ = db.command;

  let id = event.id;
  let data = event.data

  try{
    return await db.collection('communication').doc(id).update({
      data:{
        discussreply:_.push(data)
      },
      success: (res)=> {
        return res
      }
    })
  }catch(error){
    return error;
  }

}