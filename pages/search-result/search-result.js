// pages/search-result/search-result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword:"",
    toView: 'green',
    focus:false,
    height: wx.getSystemInfoSync().windowHeight - 100
  },
  scrollToTop() {
    console.log('scrollToTop')
  },
  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
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
  onTabsClick(event){
    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.searchKeyword)
    this.setData({searchKeyword:options.searchKeyword})
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