// pages/myshop/shop-value/shop-value.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDetail:{}
  },
  goRecord(e){
    let type=e.currentTarget.dataset.type
    wx.navigateTo({
      url:'/pages/myshop/shop-receive-record/shop-receive-record?type='+type
    })
  },
  fetchData(){
    let that = this
    api.post({
      url:'/myShop/toMyMoney',
      data:{},
      success(res){
        console.log(res)
        if(res.code == 200){

        }
      }
    })
  },
  goApply(){
    wx.navigateTo({
      url:'/pages/myshop/shop-encash/shop-encash'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
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