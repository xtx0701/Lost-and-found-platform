// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    movies: [{
        url: '../../images/Rotating/3.jpg'
      },
      {
        url: '../../images/Rotating/news.png'
      },
      {
        url: '../../images/Rotating/1.jpg'
      },
      {
        url: '../../images/Rotating/2.jpg'
      }
    ],
  },

  async onLoad() {
    var that = this;
    const db = wx.cloud.database({ // 链接数据表
      env: "xhm-3gaxlhxe5a2219f2"
    });
    db.collection('announcement').where({}).get({
      success: function (res) {
        let all = []
        // res.data 包含该记录的数据
        for (let i = 0; i < 3; i++) {
          all.push(res.data[i])
        }
        that.setData({
          arr: all,
        })
      }
    })
  },
  onShow(){
    wx.cloud.callFunction({
      name:"get_firstcarousel"
    }).then(res=>{
      this.setData({
        indeximg:res.result.data
      })
    })
    
    this.tabBar()
  },
  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:0
      })
    }
  },
  navigator(e) {
    wx.reLaunch({
      url: "../hall/hall"
    })
  }
})