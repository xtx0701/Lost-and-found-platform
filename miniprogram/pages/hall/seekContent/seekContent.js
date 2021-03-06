Page({

  /**
   * 页面的初始数据
   */
  data: {
    seek:[],
    about:"none",
    call:"",
  },

  onShow: function () {
  },

  onLoad: function (option) {
    wx.showLoading({
      title: '数据加载中...',
    });

    var that = this;
    this.setData({
      option: option.id
    })
    const db = wx.cloud.database({ // 链接数据表
      env: "xhm-3gaxlhxe5a2219f2"
    });
    db.collection('seekThing').where({ //数据查询
      _id: that.data.option //条件
    }).get({
      success: function (res) {
        that.setData({
          seek:res.data[0]
        })
        console.log(that.data.seek);
      }
    })
    wx.hideLoading(); //隐藏正在加载中
  },

  showPop() {
    if (this.data.about === "none") {
      this.setData({
        about: "block"
      })
    } else {
      this.setData({
        about: "none"
      })
    }
  },

})