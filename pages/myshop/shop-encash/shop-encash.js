// pages/myshop/shop-encash/shop-encash.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    count:'',
    availableCommission:0
  },
  onNickNameChange(event){
    this.setData({nickName:event.detail})
  },
  onCountChange(event){
    this.setData({count:event.detail})
  },
  fetchData(){
    let that = this
    api.post({
      url:'/myShop/toMyMoney',
      data:{},
      success(res){
        console.log(res)
        if(res.code == 200){
          that.setData({
            availableCommission:res.data.commission
          })

        }
      }
    })
  },
  submitForm() {
    let that = this
    if (parseInt(that.data.count) > 0 && parseInt(that.data.count)<=that.data.availableCommission) {
      api.post({
        url:'/myShop/CommissionOut',
        data:{
          money:that.data.count
        },
        success(res){
          if(res.code == 200){
            wx.showToast({
              title:'转出到余额成功！',
              icon:'success',
              duration:2000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta:1
              })
            },2000)
          }
        }
      })
    }else {
      wx.showToast({
        title:'请输入正确的金额！',
        icon:'none',
        duration:1000
      })
    }
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