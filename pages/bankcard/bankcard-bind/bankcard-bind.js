// pages/bankcard/bankcard-bind/bankcard-bind.js

import {bankCardAttribution} from "../../../utils/bink-list";
const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    cardNum:'',
    bankName:'',
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    showSelect:false,
    correctCard:false
  },
  checkBankCard(){
    let that = this
    let res=bankCardAttribution(that.data.cardNum)
    console.log(res)
    if(res!='error'){
      that.setData({
        correctCard:true,
        bankName:res.bankName
      })
    }else {
      wx.showToast({
        title:'请输入正确的银行卡号！',
        icon:'none',
        duration:1000
      })
    }
  },

  selectCardName(e){
    console.log(e.detail.value)
    let that = this
    that.setData({
      bankName:e.detail.value,
      showSelect:false
    })
  },
  onCloseSelect(){
    let that = this
    that.setData({
      showSelect:false
    })
  },
  showSelect(){
    let that = this
    that.setData({
      showSelect:true
    })
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
  },
  onNameChange(event){
    this.setData({name:event.detail})
  },
  onCardNumChange(event){
    this.setData({cardNum:event.detail})
  },
  submitForm(){
    let that = this
    if(that.data.name==''){
      wx.showToast({
        title:'请输入持卡人姓名',
        icon:'none',
        duration:1000
      })
    }else if(!that.data.correctCard){
      wx.showToast({
        title:'请输入正确的银行卡号',
        icon:'none',
        duration:1000
      })
    }else {
      api.post({
        url:'/myMoney/addBankCard',
        data:{
          bankName:that.data.bankName,
          cardid:that.data.cardNum,
          // imageurl:'',
          cardName:that.data.name,
        },
        success(res){
          if(res.code == 200){
            wx.navigateTo({
              url:'/pages/bankcard/bankcard-bind3/bankcard-bind3'
            })
          }else{
            wx.showToast({
              title:res.message,
              icon:'none',
              duration:2000
            })
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