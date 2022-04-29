Component({
  properties: {

  },
  data: {
    selected:0,
    tabList:[
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/hall/hall",
        "text": "大厅"
      },
      {
        "pagePath": "pages/newrelease/index",
        "text": "发布"
      },
      {
        "pagePath": "pages/sharemessage/release/index",
        "text": "社区"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的"
      }
    ]
  },
  methods: {
    switchTab(e){
      let key = Number(e.currentTarget.dataset.index);
      let tabList = this.data.tabList;
      let selected = this.data.selected;

      if(selected !== key){
        this.setData({
          selected:key
        });
        wx.switchTab({
          url: `/${tabList[key].pagePath}`,
        })
      }
    }
  }
})
