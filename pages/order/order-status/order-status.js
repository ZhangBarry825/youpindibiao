// pages/order/order-status/order-status.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   * orderStatus：1等待买家付款  2等待卖家发货  3卖家已发货  4交易成功
   */
  data: {
    orderStatus:4,
    orderid:'',
    orderDetail:{}
  },
  fetchData(){
    let that = this
    api.post({
      url:'/order/orderSelectById',
      data:{
        orderid:that.data.orderid
      },
      success(res){
        if(res.code == 200){
          that.setData({
            orderDetail:res.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderid=options.orderid
    this.setData({
      orderid:orderid
    })
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