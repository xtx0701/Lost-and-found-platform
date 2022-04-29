const app = getApp()
Page({
  data: {
    imgList:[],
  },
  onLoad: function (options) {
  },
  ChooseImage() {
    var that = this
    wx.chooseImage({
      count: 9, //默认3
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album','camera'], //从相册选择
      success: (res) => {
        res.tempFilePaths.forEach(v => {
          that.setData({
            imgList: that.data.imgList.concat(v)
          });
        })
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除这张照片？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            shows:false,
            weigui:false,
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  submitComment:function(){
    var that = this
    if(this.data.textareaAValue == undefined && this.data.imgList.length == 0){
     wx.showToast({
       title: '写点什么吧',
       icon: 'none',
       duration: 2000,
     })
     return false
   }

   var content = {};
   content.text = that.data.textareaAValue;
   var time = Date.parse(new Date()) / 1000;
   var imgList = that.data.imgList;
   var img = [];
   var userInfo = wx.getStorageSync('userinfo')
   wx.showLoading({
     title: '发布中',
   })
   let PromiseArr = [];
   for (var i = 0; i < imgList.length; i++) {
     PromiseArr.push(new Promise((reslove, reject) =>{
       var name = imgList[i].split("/").pop();
       wx.cloud.uploadFile({
         cloudPath: "community/" + name,
         filePath: imgList[i],
         success: res => {
           // console.log(res)
           img.push(res.fileID);
           reslove();
           wx.hideLoading();
           wx.showToast({
             title: "发布成功",
           })
         },
         fail: err => { 
           wx.hideLoading();
           wx.showToast({
             title: "发布失败",
           })
         }
       })
     }))
   }
   Promise.all(PromiseArr).then(res => {
     content.img = img;
     wx.cloud.callFunction({
       name: 'add_community',
       data: {
         time: time,
         openid:app.globalData.openid,
         content: content,
         image:content.img,
         nickname:wx.getStorageSync('userinfo').nickname,
         text:content.text,
         userinfo:wx.getStorageSync('userinfo')
       },
       success: res => {
         // console.log(res)
         wx.navigateBack({
           delta: 1
         }, 1000)
       }
     })
  }, 3000)  
  }
})