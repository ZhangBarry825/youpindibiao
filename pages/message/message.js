// pages/message/message.js
import {formatTime} from "../../utils/util";

const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize:10,
    pageNum:1,
    messageList:[]
  },

  fetchData(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/note/selectNotePageList',
      data:{
        pageSize:that.data.pageSize,
        pageNum:pageNum,
      },
      noLogin:true,
      success(res){
        console.log(res)
        if(res.data.list.length>0){
          for (const appendKey in res.data.list) {
            res.data.list[appendKey].createtime=formatTime(res.data.list[appendKey].createtime)
          }
          if(append){
            that.setData({
              messageList:that.data.messageList.concat(res.data.list),
              pageNum:pageNum
            })
          }else {
            that.setData({
              messageList:res.data.list
            })
          }
        }else {
          wx.showToast({
            title:'暂无更多',
            icon:'none',
            duration:1000
          })
        }
      }
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
    this.fetchData(this.data.pageNum+1,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})