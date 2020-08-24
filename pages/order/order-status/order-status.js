// pages/order/order-status/order-status.js
import {formatTime} from "../../../utils/util";
const api = require('../../../utils/api.js');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   * orderStatus：0等待买家付款  1等待卖家发货  2卖家已发货  3待评价 4交易成功 5退货/退款中  6退款成功
   */
  data: {
    baseUrl:api.Host+'/',
    orderStatus:0,
    orderid:'',
    orderDetail:{},
    timeData: {},
  },
  commentOrder(e){
    let item=e.currentTarget.dataset.item
    console.log(item)
    wx.showToast({
      title:'TODO',
      icon:'none',
      duration:1000
    })
    wx.setStorageSync('commentItem',JSON.stringify(item))
    wx.navigateTo({
      url:'/pages/order/order-appraise/order-appraise'
    })
  },
  pay(){
    let that = this
    api.post({
      url:'/order/waitPay',
      data:{
        orderid:that.data.orderid
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
            success (res1) {
              wx.navigateTo({
                url:'/pages/order/order-payed/order-payed?orderid='+JSON.stringify(res.data.orderids)
              })
            },
            fail (res) {
              wx.showToast({
                title:'支付失败！',
                icon:'none',
                duration:1000
              })
            }
          })
        }else if(res.code == 205 ){
          wx.showToast({
            title:res.message,
            icon:'none',
            duration:2000
          })
        }else{
          wx.showToast({
            title:'数据异常',
            icon:'none',
            duration:1000
          })
        }
      }
    })
  },
  cancelOrder(){
    let that = this
    Dialog.confirm({
      title: '提示',
      context:that,
      selector:'#van-dialog',
      message: '确认取消吗？',
    }).then(() => {
      api.post({
        url:'/order/orderlistDel',
        data:{
          orderid:that.data.orderid
        },
        success(res){
          if(res.code == 200){
            wx.showToast({
              title:'取消成功！',
              icon:'success',
              duration:1000
            })
            setTimeout(()=>{
              wx.switchTab({
                url:'/pages/mine/mine'
              })
            },1000)
          }
        }
      })
    }) .catch(() => {
      // on cancel
    });
  },
  goRefundDetail(e){
    let orderid=e.currentTarget.dataset.item.id
    wx.navigateTo({
      url:'/pages/order/refund-detail/refund-detail?orderid='+orderid
    })
  },
  goExpress(e){
    let orderid=e.currentTarget.dataset.item.id
    wx.navigateTo({
      url:'/pages/order/express/express?orderid='+orderid
    })
  },
  applyRefund(e){
    let item=e.currentTarget.dataset.item
    console.log(item)

    let orderid=e.currentTarget.dataset.item.id
    let payNum=e.currentTarget.dataset.item.payment
    console.log(orderid)
    console.log(payNum)
    wx.navigateTo({
      url:'/pages/order/apply-refund/apply-refund?orderid='+orderid+'&payNum='+payNum
    })
  },
  deleteOrder(e){
    let that = this
    let orderid=that.data.orderid
    Dialog.confirm({
      title: '提示',
      context:that,
      selector:'#van-dialog',
      message: '确认删除吗？',
    }).then(() => {
      api.post({
        url:'/order/orderDel',
        data:{
          orderid:orderid
        },
        success(res){
          if(res.code == 200 && res.message=='订单删除成功'){
            wx.showToast({
              title:'删除成功！',
              icon:'success',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta:1
              })
            },1000)
          }else if(res.message=='当前订单状态无法删除'){
            wx.showToast({
              title:'请先评价订单后进行操作',
              icon:'none',
              duration:1500
            })
          }
        }
      })
    })
        .catch(() => {
          // on cancel
        });

  },
  confirmReceive(){
    let that = this
    Dialog.confirm({
      title: '提示',
      message: '确认收货吗？',
      context:that,
      selector:'#van-dialog',
    })
        .then(() => {
          api.post({
            url:'/order/orderReceiving',
            data:{
              orderid:that.data.orderid
            },
            success(res){
              if(res.code == 200){
                wx.showToast({
                  title:'确认收货成功！',
                  icon:'success',
                  duration:1000
                })
                setTimeout(()=>{
                  that.fetchData()
                },1000)
              }
            }
          })
        })
        .catch(() => {
          // on cancel
        });


  },
  onTimeOut(){
    wx.showToast({
      title:'当前订单已失效，请重新下单！',
      icon:'none',
      duration:2000
    })
    setTimeout(()=>{
      wx.navigateBack({
        delta:1
      })
    },2000)
  },
  onTimeChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  fetchData(){
    let that = this
    api.post({
      url:'/order/orderSelectById',
      data:{
        orderid:that.data.orderid
      },
      success(res){
        if(res.code == 200){
          res.data.createtime=formatTime(res.data.createtime)
          res.data.paytime=formatTime(res.data.paytime)
          res.data.sendtime=formatTime(res.data.sendtime)
          res.data.receivetime=formatTime(res.data.receivetime)
          res.data.paytype=parseInt(res.data.paytype)
          res.data.leftDate=res.data.endDate-res.data.nowDate
          that.setData({
            orderStatus:res.data.status,
            orderDetail:res.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderid=options.orderid
    this.setData({
      orderid:orderid
    })
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
    this.fetchData()

    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
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