Page({
  data: {
    picker: ['衣裤鞋', '电子设备', '化妆品', '生活用品', '学习类', '其他'],
    check: ['是', '否'],
    imgList1: [],
    imgList2: [],
    openid: "",
    indexTitle: 0
  },

  //失物招领分类选择
  PickerChange(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  //寻物启事分类选择
  PickerChange2(e) {
    this.setData({
      index3: e.detail.value
    })
  },

  //失物招领验证选择
  checkChange(e) {
    this.setData({
      index2: e.detail.value
    })
  },
  //失物招领图片预览
  ViewImage1(e) {
    wx.previewImage({
      urls: this.data.imgList1,
      current: e.currentTarget.dataset.url
    });
  },
  //寻物启事图片预览
  ViewImage2(e) {
    wx.previewImage({
      urls: this.data.imgList2,
      current: e.currentTarget.dataset.url
    });
  },
  //失物招领图片选择
  ChooseImage1() {
    var that = this
    wx.chooseImage({
      count: 3, //默认3
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        res.tempFilePaths.forEach(v => {
          that.setData({
            imgList1: that.data.imgList1.concat(v)
          });
        })
      }
    });
  },
  //寻物启事图片选择
  ChooseImage2() {
    var that = this
    wx.chooseImage({
      count: 3, //默认3
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        res.tempFilePaths.forEach(v => {
          that.setData({
            imgList2: that.data.imgList2.concat(v)
          });
        })
      }
    });
  },
  //失物招领图片删除
  DelImg1(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除这张照片？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList1.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList1: this.data.imgList1
          })
        }
      }
    })
  },
  //寻物启事图片删除
  DelImg1(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除这张照片？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList2.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList2: this.data.imgList2
          })
        }
      }
    })
  },
  //失物招领发布
  submitthing(e) {
    console.log(e)
    for (let i in e.detail.value) {
      if (e.detail.value[i] == null || e.detail.value[i] == "") {
        wx.showToast({
          title: '请把资料填写完成',
          icon: "error"
        })
        return;
      }
    }
    var that = this
    var imgList = that.data.imgList1;
    var img = [];
    wx.showLoading({
      title: '发布中',
    })
    let PromiseArr = [];
    //上传图片到云存储
    for (var i = 0; i < imgList.length; i++) {
      PromiseArr.push(new Promise((reslove, reject) => {
        var name = imgList[i].split("/").pop();
        wx.cloud.uploadFile({
          cloudPath: "losthouse/" + name,
          filePath: imgList[i],
          success: res => {
            img.push(res.fileID);
            reslove();
            wx.hideLoading();
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
    //保存数据到losething云数据库里
    Promise.all(PromiseArr).then(res => {
      const db = wx.cloud.database({
        env: "xhm-3gaxlhxe5a2219f2"
      });
      db.collection('loseThing').add({
        data: {
          headImg: wx.getStorageSync('userinfo').avatarUrl,
          userName: wx.getStorageSync('userinfo').nickName,
          remark: e.detail.value.remark,
          title: e.detail.value.itemTitle,
          upshot: "认领中",
          offOn: e.detail.value.sellOnline,
          nowThing: this.data.picker[e.detail.value.itemClassification],
          image: img,
          addRess: e.detail.value.addRess,
          nowLocation: e.detail.value.thingLocation,
          userWx: e.detail.value.userWx
        },
        success: function (res) {
          wx.hideLoading(); //隐藏正在加载中
          wx.showToast({
            title: '感谢你拾金不昧',
            success: res => {
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500)
            }
          })
        }
      })
    })

  },

  title(e) {
    this.setData({
      title: e.detail.value
    })
  },



  indexTitle1() {
    this.setData({
      indexTitle: 0
    })
  },
  indexTitle2() {
    this.setData({
      indexTitle: 1
    })
  },

  //上传寻物启事
  submitseek(e) {
    for (let i in e.detail.value) {
      if (e.detail.value[i] == null || e.detail.value[i] == "") {
        wx.showToast({
          title: '请把资料填写完成',
          icon: "error"
        })
        return;
      }
    }
    console.log(e)
    var that = this
    var imgList = that.data.imgList2;
    var img = [];
    wx.showLoading({
      title: '发布中',
    })
    let PromiseArr = [];
    for (var i = 0; i < imgList.length; i++) {
      PromiseArr.push(new Promise((reslove, reject) => {
        var name = imgList[i].split("/").pop();
        wx.cloud.uploadFile({
          cloudPath: "seekhouse/" + name,
          filePath: imgList[i],
          success: res => {
            img.push(res.fileID);
            console.log(img);
            reslove();
            wx.hideLoading();
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
      const db = wx.cloud.database({
        env: "xhm-3gaxlhxe5a2219f2"
      });
      db.collection('seekThing').add({
        data: {
          headImg: wx.getStorageSync('userinfo').avatarUrl,
          userName: wx.getStorageSync('userinfo').nickName,
          upshot: "丢失",
          seekRemark: e.detail.value.seekremark,
          seekTitle: e.detail.value.seekTitle,
          seekuserWx: e.detail.value.seekuserWx,
          image: img,
          seekNowThing: this.data.picker[e.detail.value.seekClassification],
          seekRess: e.detail.value.seekRess,
        },
        success: function (res) {
          wx.hideLoading(); //隐藏正在加载中
          wx.showToast({
            title: '请您耐心等待',
            success: res => {
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500)
            }
          })
        }
      })
    })
  },

  onLoad(options) {
    const { indexTitle } = options
    this.setData({
      indexTitle: parseInt(indexTitle)
    })
    if (wx.getStorageSync('openid')) {
      this.setData({
        openid: "不再是null"
      })
    }
  }
})