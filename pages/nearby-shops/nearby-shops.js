// pages/nearby-shops/nearby-shops.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import {formatTimeTwo, saveOneDecimal, saveTwoDecimal} from "../../utils/util";
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword:"",
    focus:false,
    height: wx.getSystemInfoSync().windowHeight - 100,
    activeIndex:0,
    pageSize:10,
    pageNum:1,
    latitude:'',
    longitude:'',
    shopList:[]
  },
  changeMenu(e){
    this.setData({
      activeIndex:e.currentTarget.dataset.index
    })
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
  getLocation(){
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy  //位置精确度
        that.setData({
            latitude:latitude,
            longitude:longitude,
        })
        that.fetchData()
      },
      fail(){
        Dialog.confirm({
          title: '提示',
          message: '请授权位置信息，以更好地使用本程序',
        }).then(() => {
          wx.openSetting()
        }).catch(() => {
          // on cancel
        });
      }
    })

  },
  fetchData(pageNum=1,append=false){
    let that = this
    api.post({
      url:'/business/moreBusinessList',
      data:{
        pageNum:pageNum,
        pageSize:that.data.pageSize,
        lat:that.data.latitude,
        lng:that.data.longitude,
      },
      noLogin:true,
      success(res){
        for (const resKey in res.data.list) {
          res.data.list[resKey].nearby_img=api.Host+'/'+res.data.list[resKey].nearby_img
          res.data.list[resKey].end_time=formatTimeTwo(res.data.list[resKey].end_time)
          res.data.list[resKey].start_time=formatTimeTwo(res.data.list[resKey].start_time)
          res.data.list[resKey].distance=saveTwoDecimal(res.data.list[resKey].distance)
          res.data.list[resKey].shopstar=saveOneDecimal(res.data.list[resKey].shopstar)
        }

        that.setData({
          shopList:res.data.list
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        height: wx.getSystemInfoSync().windowHeight - 100,
      })
    })
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
    this.getLocation()
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