// pages/order/order-confirm/order-confirm.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    showPay:false,
    payType:'0',
    payTypeText:'余额支付',
    goodsList:[],
    addressDetail: '',
    totalPrice:0.00,
    shopid:'',//附近商家的商品会有shopid
  },
  minusNum(){
    let that = this
    if(that.data.goodsList[0].number>1){
      let totalPrice=parseFloat(that.data.goodsList[0].goods.freight)
      totalPrice+=(that.data.goodsList[0].number-1)*that.data.goodsList[0].sku.goodsPrice
      that.setData({
        ['goodsList[0].number']:that.data.goodsList[0].number-1,
        totalPrice:totalPrice
      })
    }
  },
  addNum(){
    let that = this
    let totalPrice=parseFloat(that.data.goodsList[0].goods.freight)
    totalPrice+=(that.data.goodsList[0].number+1)*that.data.goodsList[0].sku.goodsPrice
    that.setData({
      ['goodsList[0].number']:that.data.goodsList[0].number+1,
      totalPrice:totalPrice
    })
  },
  goAddressList(){
    wx.navigateTo({
      url:'/pages/address-list/address-list?type=select'
    })
  },
  onPayChange(event){
    const { type } = event.currentTarget.dataset;
    console.log(type)
    let payTypeText=''
    if(type=='1'){
      payTypeText='微信支付'
    }else {
      payTypeText='余额支付'
    }
    this.setData({
      payType: type,
      payTypeText:payTypeText,
      showPay:false
    });
  },
  onPayShow(){
    this.setData({showPay:true})
  },
  onPayClose(){
    this.setData({showPay:false})
  },
  fetchData(){
    let that = this
    api.post({
      url:'/user/selectAddressList',
      data:{
        token:wx.getStorageSync('token')
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          if(res.data.length>0){
            that.setData({
              // addressDetail:res.data[0]
              addressDetail:res.data[0]
            })
          }
        }
      }
    })
  },
  submitForm(){
    let that = this
    let formData={
      goodsid:that.data.goodsList[0].goods.id,
      addressid:that.data.addressDetail.id||'',
      paytype:that.data.payType,
      shuliang:that.data.goodsList[0].number,
      shopid:that.data.shopid,
      notes:that.data.message,
      skuid:that.data.goodsList[0].sku.id,
      goodsParam:that.data.goodsList[0].goodsParam,
    }
    console.log(formData)
    if(!formData.addressid){
      wx.showToast({
        title:'请添加配送地址',
        icon:'none',
        duration:1000
      })
    }else {
      console.log(formData)
      api.post({
        url:'/order/addOrderByGoods',
        data:{...formData},
        success(res){
          if(res.code == 200 && res.message!='余额不足'){
            if(that.data.payType==0){
              wx.navigateTo({
                url:'/pages/order/order-payed/order-payed?orderid='+res.data
              })
            }else{
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: 'prepay_id=123123',
                signType: 'MD5',
                paySign: res.data.paySign,
                success (res) {
                  console.log(res,'success')
                },
                fail (res) {
                  console.log(res,'fail')
                }
              })
            }
          } else if(res.message!='余额不足'){
            wx.showToast({
              title:'您的余额不足！',
              icon:'none',
              duration:1000
            })
          }
        }
      })
    }

  },
  messageChange(e){
    this.setData({
      message:e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let type=options.type
    let shopid=options.shopid
    if(shopid){
      this.setData({
        shopid:shopid
      })
    }
    console.log(options,'options')
    console.log(options.goodsList,'options.goodsList')
    let goodsList=JSON.parse(options.goodsList)
    if(type=='goods'){
      let totalPrice=parseFloat(goodsList[0].goods.freight)
      for (const apiKey in goodsList) {
        totalPrice+=goodsList[apiKey].number*goodsList[apiKey].sku.goodsPrice
      }
      that.setData({
        goodsList:goodsList,
        totalPrice:totalPrice
      })
    }else if(type=='trolley'){

    }
    that.fetchData()

    console.log(goodsList)
    // that.fetchData()
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