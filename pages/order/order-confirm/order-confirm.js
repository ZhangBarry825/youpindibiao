// pages/order/order-confirm/order-confirm.js
const api = require('../../../utils/api.js');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    showPay:false,
    payType:'1',
    payTypeText:'微信支付',
    couponText:'请选择',
    goodsList:[],
    addressDetail: '',
    totalPrice:0.00,
    shopid:'',//附近商家的商品会有shopid
    canSubmit:true,
    showCoupon:false,
    couponList:[],//优惠券列表
    couponSelected: {
      coupon:{
        couponQuota:0
      }
    },//选中优惠券
  },
  fetchCoupon(){
    let that = this
    let paramArrStr=[]
    that.data.goodsList.map(item=>{
      paramArrStr.push({
        goodsId:item.goods.id,
        skuId:item.sku.id,
        goodNum:item.number,
      })
      return item
    })
    api.post({
      url:'/coupon/getSettlementList',
      data:{
        paramArrStr:JSON.stringify(paramArrStr)
      },
      success(res){
        if(res.code == 200 && res.data.length>0){
          res.data.map(item=>{
            item.selected=false
            return item
          })
          that.setData({
            couponList:res.data[0].couponList,
            couponSelected:{
              coupon:{
                couponQuota:0
              }
            },
            couponText:'请选择',
          })
        }else {
          that.setData({
            couponList:[],
            couponSelected:{
              coupon:{
                couponQuota:0
              }
            },
            couponText:'请选择',
          })
        }
        console.log(res.data[0].couponList)
      }
    })
  },
  selectCoupon(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let couponList=that.data.couponList.map(item=>{
      item.selected=false
      return item
    })
    couponList[index].selected=true
    that.setData({
      couponList:couponList,
      couponSelected:couponList[index],
      couponText:'已优惠'+couponList[index].coupon.couponQuota+'元',
      showCoupon:false
    })
  },
  cancelCoupon(e){
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['couponList['+index+'].selected']:false,
      couponSelected: {
        coupon:{
          couponQuota:0
        }
      },
      couponText:'请选择'
    })
  },
  showCoupon(){
    let that = this
    that.setData({
      showCoupon:true
    })
  },
  onCloseCoupon(){
    let that = this
    // let couponList=that.data.couponList.map(item=>{
    //   item.selected=false
    //   return item
    // })
    that.setData({
      showCoupon:false,
      // couponList:couponList
    })
  },
  onConfirmCoupon(){
    let that = this
    that.setData({
      showCoupon:false
    })
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
      this.fetchCoupon()
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
    this.fetchCoupon()
  },
  goAddressList(){
    wx.navigateTo({
      url:'/pages/address-list/address-list?type=select'
    })
  },
  onPayChange(event){
    const { type } = event.currentTarget.dataset;
    //console.log(type)
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
        //console.log(res)
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
    if(!this.data.canSubmit){
      //console.log('稍安勿躁')
      return
    }
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
    if(this.data.couponSelected.id){
      formData.couponUserId=that.data.couponSelected.id
    }
    console.log(formData)
    if(!formData.addressid){
      wx.showToast({
        title:'请添加配送地址',
        icon:'none',
        duration:1000
      })
    }else {
      if(that.data.payType=='0'){
        Dialog.confirm({
          title: '提示',
          message: '确认余额支付？',
        }).then(() => {
              api.post({
                url:'/order/addOrderByGoods',
                data:{...formData},
                success(res){
                  if(res.code == 200 && res.message!='余额不足' && res.message!='商品库存不足'){
                    wx.navigateTo({
                      url:'/pages/order/order-payed/order-payed?orderid='+JSON.stringify(res.data)
                    })
                  } else if(res.message=='余额不足'){
                    wx.showToast({
                      title:'您的余额不足！',
                      icon:'none',
                      duration:1000
                    })
                  } else if(res.message=='商品库存不足'){
                    wx.showToast({
                      title:'商品库存不足',
                      icon:'none',
                      duration:1000
                    })
                  }
                }
              })
            }).catch(() => {
              // on cancel
            });
      }else {
        that.setData({
          canSubmit:false
        })
        api.post({
          url:'/order/addOrderByGoods',
          data:{...formData},
          success(res){
            if(res.code == 200 && res.message!='余额不足' && res.message!='商品库存不足'){
              let orderids=res.data.orderids
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                total_fee: res.data.total_fee,
                success (res1) {
                  wx.navigateTo({
                    url:'/pages/order/order-payed/order-payed?orderid='+JSON.stringify(orderids)
                  })
                },
                fail (res) {
                  wx.showToast({
                    title:'支付失败！',
                    icon:'none',
                    duration:2000
                  })
                  setTimeout(()=>{
                    wx.redirectTo({
                      url:'/pages/order/order-status/order-status?orderid='+orderids[0]
                    })
                  },2000)
                }
              })
            } else if(res.message=='余额不足'){
              wx.showToast({
                title:'您的余额不足！',
                icon:'none',
                duration:2000
              })
            } else if(res.message=='商品库存不足'){
              wx.showToast({
                title:'商品库存不足',
                icon:'none',
                duration:2000
              })
            }
          }
        })
      }
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
    that.fetchCoupon()


    console.log(goodsList,'goodsList')
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
    let that = this
    that.setData({
      canSubmit:true
    })
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