// pages/class/class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword:"",
    focus:false,
    height: wx.getSystemInfoSync().windowHeight - 55,
    mainActiveIndex: 0,
    activeId: null,
    navItems:[
      {
        id:0,
        text:'手机平板',
      },
      {
        id:1,
        text:'童装、玩具',
      },
      {
        id:2,
        text:'户外运动',
      },
      {
        id:0,
        text:'手机平板',
      },
      {
        id:1,
        text:'童装、玩具',
      },
      {
        id:2,
        text:'户外运动',
      },
      {
        id:0,
        text:'手机平板',
      },
      {
        id:1,
        text:'童装、玩具',
      },
      {
        id:2,
        text:'户外运动',
      }
    ]
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickNavItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
  },
  onSearchFocus(){
    this.setData({
      focus:true
    })
  },
  onSearchCancel(){
    console.log('onSearchCancel')
    this.setData({
      searchKeyword:'',
      focus:false
    })
  },
  onSearchClick(){
    console.log(this.data.searchKeyword)
  },
  onSearchChange(e){
    this.setData({
      searchKeyword:e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})