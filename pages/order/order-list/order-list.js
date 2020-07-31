// pages/order/order-list/order-list.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagsActive: 'all',
    height: wx.getSystemInfoSync().windowHeight - 50,
    state:0,
    orderList:[],
    baseUrl:api.Host+'/',
    pageSize:10,
    pageNum:1
  },
  confirmReceive(e){
    let that = this
    let orderid=e.currentTarget.dataset.orderid
    Dialog.confirm({
      title: '提示',
      message: '确认收货吗？',
    })
        .then(() => {
          api.post({
            url:'/order/orderReceiving',
            data:{
              orderid:orderid
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
  goOrderDetail(e){
    let orderid=e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/order/order-status/order-status?orderid='+orderid
    })
  },
  onTagChange(event){
    let state=event.detail.name
    if(event.detail.name=='all'){
      state=''
    }
    this.setData({
      state:state,
      orderList:[]
    })
    this.fetchData(state)
  },
  fetchData(state='',pageNum=1,append=false){
    let that = this
    api.post({
      url:'/order/orderlist',
      data:{
        state:state,
        pageNum:pageNum,
        pageSize: that.data.pageSize
      },
      success(res){
        console.log(res)
        if(res.code == 200){
          if(res.data.length>0){
            if(append){
              that.setData({
                orderList:that.data.orderList.concat(res.data),
                pageNum:pageNum
              })
            }else {
              that.setData({
                orderList:res.data
              })
            }
          }else {
            wx.showToast({
              title:'暂无更多',
              icon:'none',
              duration:1000
            })
          }


        }
      }
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
  goHome(){
    wx.switchTab({
      url:'/pages/home/home'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        height: wx.getSystemInfoSync().windowHeight - 50
      })
      this.setData({
        tagsActive:options.tagsActive||'all'
      })
    },100)
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
    this.setData({
      orderList:[],
      pageNum:1,
      tagsActive:'all'
    })
    this.fetchData('',1,false)
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
    let that = this
    this.fetchData(that.data.state,that.data.pageNum)

    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('到底啦')
    let that = this
    this.fetchData(that.data.state,that.data.pageNum+1,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})