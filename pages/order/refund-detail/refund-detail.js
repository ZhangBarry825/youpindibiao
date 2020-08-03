// pages/order/refund-detail/refund-detail.js
import {formatTime} from "../../../utils/util";

const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:3,
    orderid:'',
    refundDetail:0
  },
  fetchData(){
    let that = this
    api.post({
      url:'/returnGoods/selectReturnGoodsById',
      data:{
        returnGoodsId:that.data.orderid
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          res.data.applyTime=formatTime(res.data.applyTime)
          res.data.examineTime=formatTime(res.data.examineTime)
          res.data.successTime=formatTime(res.data.successTime)
          that.setData({
            refundDetail:res.data,
            status:res.data.status
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid:options.orderid
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