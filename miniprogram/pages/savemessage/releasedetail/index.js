var util = require("../../../utils/newutil");
var _Disscuss = require("../../../utils/communication.js");
const app = getApp()

var discuss_id;
var comment_id;
Page({
  data: {
    communication: {},
    comments: [],
    showInput: false, //控制输入栏
  },
  //显示评论框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  //显示回复框
  reply_showModal(e) {
    this.setData({
      reply_modalName: e.currentTarget.dataset.target
    })
    comment_id = e.currentTarget.dataset.id;
  },
  //隐藏评论框
  hideModal(e) {
    this.setData({
      modalName: null
    })
    comment_id = null;
  },
  //隐藏回复框
  reply_hideModal() {
    this.setData({
      reply_modalName: null
    })
  },

  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    })
    this.userInfo = wx.getStorageSync('userinfo')
    discuss_id = id
    this.communication(id)
  },
  onShow(){
    this.get_discuss(this.data.id)
    wx.cloud.callFunction({
      name: 'get_communitysave',      //先获取是否有收藏的数据
      data:{
        openid:app.globalData.openid
      },
    }).then(res =>{
      if(res.result.data == ''){            //当没有的时候创建一个savelist=[]的数组
        wx.cloud.callFunction({
          name: 'add_communitysave',
          data:{
            openid:app.globalData.openid,
          },
        }).then(res =>{
          var saveList = []                //给收藏加一个判断隐藏
          var Collect = this.data.Collect
          Collect = false 
          this.setData({
            saveList:saveList,
            _id:res.result._id,
            Collect:Collect,
          })
        })
      }else if(res.result.data[0].saveList.includes(this.data.communication._id)){      //当收藏的数据库里有当前页面的id
        var Collect = this.data.Collect
        Collect = true                   //显示
        var saveList = res.result.data[0].saveList
        this.setData({
          saveList:saveList,
          _id:res.result.data[0]._id,
          Collect:Collect,

        })
      }else if(res.result.data[0].saveList ==''){       //当用户删掉全部的收藏时
        var saveList = []
        var Collect = this.data.Collect
        Collect = false 
        this.setData({
          saveList:saveList,
          _id:res.result.data[0]._id,
          Collect:Collect,
        })
      }else{
        var saveList = res.result.data[0].saveList
        var Collect = this.data.Collect
        Collect = false        //显示        
        this.setData({
          saveList:saveList,
          _id:res.result.data[0]._id,
          Collect:Collect,
        })
      }
    })
  },
  //收藏
  collect:function(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      ['Collect']: !this.data.Collect           //设置收藏显示与隐藏
    })
    if (this.data.Collect) {
      this.data.saveList.push(id)
      wx.cloud.callFunction({
        name: 'update_communicationdetailsave',            
        data:{
          _id:this.data._id,
          saveList:this.data.saveList,
        },
      }).then(res =>{
        console.log(res)
      })
    } else {
      this.removeArr(this.data.saveList, id)
      wx.cloud.callFunction({
        name: 'update_communicationdetailsave',
        data:{
          _id:this.data._id,
          saveList:this.data.saveList,
        },
      }).then(res =>{
        console.log(res)
      })
      
    }
  },

  communication: function (id) { //获取顶部页面
    var that = this
    wx.cloud.callFunction({
      name: 'get_communication',
      data: {
        id: id
      },
      success: res => {
        var communication = this.dateFormatcom(res.result.data);
        this.setData({
          communication: communication
        });
          wx.cloud.callFunction({
            name:"get_userinfo",
            data:{
              openid:res.result.data.openid
            }
          }).then(res=>{
            that.setData({
              userinfo:res.result.data[0]
            })
          })
      }
    })
    this.get_discuss(id);
  },

  get_discuss(id) { //获取评论数据
    wx.cloud.callFunction({
      name: 'get_disscuss',
      data: {
        discussid: id
      },
      success: res => {
        var comments = this.dateFormatdiss(res.result.data);
        this.setData({
          comments: comments
        })
      }
    })
  },

  dateFormatcom: function (communication) { //顶部数据时间戳转换
    communication.time = util.formatTime(communication.time);
    return communication;
  },

  dateFormatdiss: function (comments) {
    for (var i = 0; i < comments.length; i++) {
      comments[i].time = util.formatTime(comments[i].disscusstime); //评论数据时间戳转换
      if (comments[i].likePeople.includes(app.globalData.openid)) {  
        comments[i].isCollect = true;
      } else {
        comments[i].isCollect = false;
      }
    }
    return comments.reverse(); //数组反转
  },


  swipclick: function (e) { //点击图片触发事件
    const idx = e.currentTarget.dataset.idx
    const image = this.data.communication.content.img;
    console.log(image)
    wx.previewImage({
      current: image[idx],
      urls: image,
    })
  },
  // 评论
  input: function (e) {
    this.setData({
      discusstext: e.detail.value
    });
  },


  send: function (e) { //点击进行评论
    var that = this
    var data = {};
    var time = Date.parse(new Date()) / 1000;
    data.openid = app.globalData.openid
    data.discusstext = that.data.discusstext;
    data.discussid = discuss_id;
    data.discussname = that.userInfo.nickName;
    data.disscussimg = that.userInfo.avatarUrl;
    data.disscusstime = time;

    if (that.data.discusstext == undefined) {
      wx.showToast({
        title: '忘记评论了哦',
        icon: 'none',
        duration: 2000,
      })
    } else {
      _Disscuss.adddisscuss(data, function (res) {
        that.onShow()                        
        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 2000
        })
      })
      that.setData({
        modalName: null,
      })
    }


  },

  //点击进行回复
  reply_send() {
    if (this.data.discusstext == undefined) {
      wx.showToast({
        title: '忘记输入了哦',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    let data = {};
    let _this = this;
    data.nickName = this.userInfo.nickName;
    data.text = this.data.discusstext;
    _Disscuss.update_discuss_reply(comment_id, data, function (res) {
      if (res.stats.updated == 1) {
        _this.get_discuss(discuss_id);
        wx.showToast({
          title: '回复中',
          icon: 'loading',
          duration: 1000,
          mask: true,
          success: () => {
            _this.onShow()
            _this.reply_hideModal();
          }
        })
      } else {
        wx.showToast({
          title: '回复失败',
          duration: 1500,
        })
      }

    })

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  closebottom(e) {
    this.setData({
      modalName: null
    })
  },

  longdelet: function (e) {                   //长按删除
    var that = this
    var _id = e.currentTarget.dataset.id
    var uploadopenid = e.currentTarget.dataset.openid
    var discussid = {}
    discussid.id = e.currentTarget.dataset.discussid
    if (uploadopenid == app.globalData.openid) {
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          _Disscuss.deletCommunication(_id)
          that.onShow()                       
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    } else {
      wx.showActionSheet({
        itemList: ['举报'],
        success(res) {
          console.log(res.tapIndex)
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  },

//点赞
  collectImage:function(e){
    var username = app.globalData.openid
    var id = e.currentTarget.dataset.id;
    // console.log(id)
    var index = e.currentTarget.dataset.index;
    var param = {};
    var likePeople = "comments[" + index + "].likePeople";
    var likeList = this.data.comments[index].likePeople;
    // console.log(likeList)
    this.setData({
      ['comments.[' + index + '].isCollect']: !this.data.comments[index].isCollect
    })

    if (this.data.comments[index].isCollect) {
      likeList.push(username)
      param[likePeople] = likeList;
      this.setData(param);
      _Disscuss.updateCommunication(id, likeList);
    } else {
      this.removeArr(likeList, username)
      param[likePeople] = likeList;
      this.setData(param);
      _Disscuss.updateCommunication(id, likeList);
    }
  },
  //数组删除某个元素
  removeArr: function (arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == item) {
        arr.splice(i, 1);
        break;
      }
    }
  },


  onShareAppMessage: function (res) {
    return {
      title: this.data.detail.name,
      path: '/pages/sharemessage/releasedetail/index?id='+ this.data.communication._id
    }
  },
})