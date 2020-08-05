// pages/myshop/shop-membership/shop-membership.js
import {formatTime} from "../../../utils/util";

const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagsActive: 1,
    pageSize:10,
    pageNum:1,
    lv:1,
    itemList:[],
    levelNum1:0,
    levelNum2:0,
    totalNum:0,
  },
  onTagChange(event){
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
    this.setData({
      lv:event.detail.name,
      itemList:[],
      pageNum:1
    })
    this.fetchData(1,event.detail.name,false)
  },
  goDetail(e){
    wx.navigateTo({
      url:'/pages/myshop/shop-membership-detail/shop-membership-detail?id='+e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        height: wx.getSystemInfoSync().windowHeight - 50,
      })
    },100)
    this.fetchData()
  },
  fetchData(pageNum=1,lv=1,append=false){
    let that = this
    api.post({
      url:'/member/getUserMember',
      data:{
        pageNum:pageNum,
        pageSize:that.data.pageSize,
        lv:lv
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          if(res.data.memberListLV1.list.length>0){
            for (const resKey in res.data.memberListLV1.list) {
              res.data.memberListLV1.list[resKey].createtime=formatTime(res.data.memberListLV1.list[resKey].createtime)
            }
            if(append){
              that.setData({
                itemList:that.data.itemList.concat(res.data.memberListLV1.list)
              })
            }else{
              that.setData({
                itemList:res.data.memberListLV1.list
              })
            }
          }else {
            if(!append){
              that.setData({
                itemList:[]
              })
            }
            wx.showToast({
              title:'暂无更多',
              icon:'none',
              duration:1000
            })
          }
          console.log(res.data)
          that.setData({
            totalNum:res.data.totalNum,
            levelNum1:res.data.oneNum,
            levelNum2:res.data.twoNum
          })
        }
      }
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