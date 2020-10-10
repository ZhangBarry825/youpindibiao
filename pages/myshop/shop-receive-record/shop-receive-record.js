// pages/myshop/shop-receive-record/shop-receive-record.js
import {formatTime} from "../../../utils/util";

const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize:10,
    pageNum:1,
    itemList:[]
  },
  fetchData(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/myShop/leijidate',
      data:{
        pageNum:pageNum,
        pageSize:that.data.pageSize,
        flag:3
      },
      success(res){
        //console.log(res)
        if(res.code == 200){
          if(res.data.list.length>0){
            for (const Key in res.data.list) {
              res.data.list[Key].createtime=formatTime( res.data.list[Key].createtime)
            }
            if(append){
              that.setData({
                itemList:that.data.itemList.concat(res.data.list),
                pageNum:pageNum
              })
            }else{
              that.setData({
                itemList:res.data.list
              })
            }
          }else{
            if(!append){
              that.setData({
                pageNum:1,
                itemList:[]
              })
            }
            wx.showToast({
              title:'暂无更多',
              icon:'none',
              duration:1000
            })
          }
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