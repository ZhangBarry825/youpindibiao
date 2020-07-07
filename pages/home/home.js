// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    showMenus:true,
    searchKeyword:"",
    tagsActive:0,
    timeTagsActive:0,
    showRedPackage:true
  },

  //领取红包
  catchRedPackage(){
    console.log('我领到红包了')
  },
  //隐藏红包
  hideRedPackage(){
    this.setData({ showRedPackage: false });
  },
  onSearchChange(event){
    console.log(event.detail)
    console.log(this.data.searchKeyword)
  },
  onSearchCancel(event){
    console.log(event.detail)
  },
  onTagsChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  onTimeTagsChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },

  toggleShow(){
    if(this.data.showMenus){
      this.setData({
        showMenus:false
      })
    }else {
      this.setData({
        showMenus:true
      })
    }
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