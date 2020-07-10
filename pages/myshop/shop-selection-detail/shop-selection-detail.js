// pages/myshop/shop-selection-detail/shop-selection-detail.js
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
    showShare:false,
    showSpecification:false,
    number:1,
  },
  minusNum(){
    if(this.data.number>1){
      this.setData({number:this.data.number-1})
    }
  },
  addNum(){
    this.setData({number:this.data.number+1})
  },
  showShare() {
    this.setData({ showShare: true });
  },
  onShareClose(){
    this.setData({ showShare: false });
  },
  showSpecification() {
    this.setData({ showSpecification: true });
  },
  onSpecificationClose(){
    this.setData({ showSpecification: false });
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