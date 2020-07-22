// pages/setting-feedback/setting-feedback.js
import {checkEmail, checkPhone} from "../../utils/util";
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    email:'',
    message:'',
  },
  onPhoneChange(event){
    console.log(event.detail);
    this.setData({
      phone:event.detail
    })
  },
  onEmailChange(event){
    console.log(event.detail);
    this.setData({
      email:event.detail
    })
  },
  onMessageChange(event){
    console.log(event.detail);
    this.setData({
      message:event.detail
    })
  },
  submitForm(){
    console.log(this.data.phone)
    console.log(this.data.email)
    console.log(this.data.message)
    if(this.data.phone==''||!checkPhone(this.data.phone)){
      wx.showToast({
        title:'请输入正确的手机号码',
        icon:'none',
        duration:1000
      })
    }else if(this.data.email==''||!checkEmail(this.data.email)){
      wx.showToast({
        title:'请输入正确的邮箱',
        icon:'none',
        duration:1000
      })
    }else if(this.data.message==''){
      wx.showToast({
        title:'请输入反馈内容',
        icon:'none',
        duration:1000
      })
    }else {
      let that = this
      api.post({
        url:'/user/addFeedback',
        data:{
          phone:that.data.phone,
          email:that.data.email,
          text:that.data.message,
        },
        success(res){
          console.log(res)
          if(res.code == 200){
            wx.showToast({
              title:'提交成功！',
              icon:'success',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta:-1
              })
            },1000)
          }
        }
      })
    }

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