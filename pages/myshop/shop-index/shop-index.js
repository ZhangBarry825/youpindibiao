// pages/mine-shop/mine-shop.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:0,//店铺状态  -1未申请 0审核中 1已通过 2未通过
  },
  fetchData(){
    let that = this
    api.post({
      url:'/businessApply/queryShopState',
      data:{},
      success(res){
        if(res.code == 500){
          that.setData({
            status:0
          })
        }
      }
    })
  },
  goApply(){
    wx.navigateTo({
      url:'/pages/myshop/shop-apply/shop-apply'
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
    this.fetchData()
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