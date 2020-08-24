// pages/charge/charge.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({value:event.detail})
  },
  submitForm(){
    let that = this
    if(parseFloat(that.data.value)>0){
      api.post({
        url:'/myMoney/orderpay',
        data:{
          money:that.data.value,
          type:0,
        },
        success(res){
          if(res.code == 200){
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              total_fee: res.data.total_fee,
              success (res) {
                console.log(res,'success')
                wx.showToast({
                  title:'支付成功！',
                  icon:'success',
                  duration:2000
                })
                setTimeout(()=>{
                  wx.navigateBack({
                    delta:1
                  })
                },2000)
              },
              fail (res) {
                console.log(res,'fail')
                wx.showToast({
                  title:'支付失败！',
                  icon:'none',
                  duration:1000
                })
              }
            })
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