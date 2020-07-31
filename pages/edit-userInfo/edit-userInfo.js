// pages/edit-userInfo/edit-userInfo.js
import {checkPhone} from "../../utils/util";

const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname:'王小二',
    nickname:'珍妮',
    phone:'158****2135',
    userInfo:{
      headimg:'',
      wxname:'',
      name:'',
      tel:'',
    }
  },
  submitForm(){
    let that = this
    console.log(that.data.userInfo)
    let {headimg,wxname,name,tel}=that.data.userInfo
    if(!that.data.userInfo.headimg||!that.data.userInfo.wxname||!that.data.userInfo.name||!that.data.userInfo.tel||!checkPhone(that.data.userInfo.tel)){
      wx.showToast({
        title:'请检查姓名、昵称和手机号',
        icon:'none',
        duration:1000
      })
    }else {
      api.post({
        url:'/user/updateUserById',
        data: {headimg,wxname,name,tel},
        success(res){
          if(res.code == 200){
            wx.showToast({
              title:'保存成功！',
              icon:'success',
              duration:1000
            })
          }
        }
      })
    }
  },
  onPhoneChange(e){
    this.setData({
      ['userInfo.tel']:e.detail
    })
  },
  onNameChange(e){
    this.setData({
      ['userInfo.wxname']:e.detail
    })
  },
  onNameChange2(e){
    this.setData({
      ['userInfo.name']:e.detail
    })
  },
  fetchData(){
    let that = this
    api.post({
      url:'/user/selectUserById',
      data:{
        token:wx.getStorageSync('token')
      },
      success(res){
        console.log(res)
        that.setData({
          userInfo:res.data
        })
      }
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