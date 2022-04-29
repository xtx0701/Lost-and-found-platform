const app = getApp()
var _DB = require("../../../utils/community.js");
var util = require("../../../utils/newutil");

Page({
  data: {
    TabCur: 0,
    page: 1,
    pageSize: 10,
    hasMoreData: true,
    contentlist: [],
    isItPaid: null,
    itemsName: null,
    lostTime: null
  },

  onLoad: function (options) {
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      windowHeight: windowHeight,
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  onShow: function () {
    this.setData({
      openid:app.globalData.openid,
      page:1
    })
    const _this = this;
    _DB.getCommunity(function (res) { //从数据库的community表里获取数据渲染页面
      // console.log(res)
      var chat = _this.dateFormat(res.list);
      _this.setData({
        chat: chat
      });
    })
    this.tabBar();
  },


  dateFormat: function (chat) {
    for (var i = 0; i < chat.length; i++) {
      chat[i].time = util.formatTime(chat[i].time); //时间戳转换
      if (chat[i].likePeople.includes(app.globalData.openid)) {
        chat[i].isCollect = true;
      } else {
        chat[i].isCollect = false;
      }
    }
    return chat.reverse(); //数组反转
  },
  imagePreview: function (event) { //图片预览
    const idx = event.currentTarget.dataset.idx
    const index = event.currentTarget.dataset.index;
    const image = this.data.chat[index].content.img;
    wx.previewImage({
      current: image[idx],
      urls: image,
    })
  },

  collectImage: function (e) {
    var username = app.globalData.openid
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var param = {};
    var likePeople = "chat[" + index + "].likePeople";
    var likeList = this.data.chat[index].likePeople;
    this.setData({
      ['chat.[' + index + '].isCollect']: !this.data.chat[index].isCollect
    })

    if (this.data.chat[index].isCollect) {
      likeList.push(username)
      param[likePeople] = likeList;
      this.setData(param);
      _DB.updateCommunity(id, likeList);
    } else {
      this.removeArr(likeList, username)
      param[likePeople] = likeList;
      this.setData(param);
      _DB.updateCommunity(id, likeList);
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

  todetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var readList = this.data.chat[index].alreadyread;
    var appear = readList.indexOf(app.globalData.openid) //判断是否存在

    if (appear >= 0) {
      // console.log('1')
    } else {
      readList.push(app.globalData.openid)
      _DB.updateAleadyread(id, readList); //阅读量
    }
    wx.navigateTo({
      url: '../releasedetail/index?id=' + id,
    })
  },

  delet: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['删除'],
      success(res) {
        _DB.deletCommunity(id);
        // console.log(that)
        that.onShow()
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  tabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
  },

  lostimagePreview: function (event) { //图片预览
    const idx = event.currentTarget.dataset.idx
    const index = event.currentTarget.dataset.index;
    const image = this.data.contentlist[index].imgList;
    var imaglist = []
    imaglist.push(image[idx].imageUrl)

    wx.previewImage({
      current: image[idx].imageUrl,
      urls: imaglist,
    })
  },

  lostthingmessage(e){
    this.setData({
      lostthing:e.detail.value
    })
  },

  refresh(){
    this.setData({
      page:1,
      contentlist:[],
      itemsName:null
    })
    this.onShow()
  },

  onPullDownRefresh: function () {
  this.onRefresh();
},
onRefresh(){
  wx.showNavigationBarLoading(); 
  this.onShow()
  wx.hideNavigationBarLoading()
},
})