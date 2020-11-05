// pages/bankcard/bankcard-had/bankcard-had.js
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankcardList:[],
    type:'',//是否选择卡片  ‘select’是  ‘ ’否
  },
  fetchData(){
    let that = this
    api.post({
      url:'/myMoney/selectBankCard',
      data:{
        bankid:''
      },
      success(res){
        //console.log(res)
        if(res.code == 200){
          for (const argumentsKey in res.data) {
            res.data[argumentsKey].codeid2=res.data[argumentsKey].codeid.substring(res.data[argumentsKey].codeid.length-4)
          }
          that.setData({
            bankcardList:res.data
          })
        }
      }
    })
  },
  deleteCard(e){
    let that = this
    Dialog.confirm({
      title: '提示',
      message: '确定删除吗？',
    })
        .then(() => {
          api.post({
            url:"/myMoney/deleteBack",
            data:{
              id:e.currentTarget.dataset.item.id
            },
            success(res){
              wx.showToast({
                title:'删除成功！',
                icon:'success',
                duration:1000
              })
              setTimeout(()=>{
                that.fetchData()
              },1000)
            }
          })
        })
        .catch(() => {
          // on cancel
        });
  },
  selectCard(e){
    if(this.data.type=='select'){
      let pages = getCurrentPages();
      let previousPage = pages[pages.length - 2];
      previousPage.setCard({
        bankName:e.currentTarget.dataset.item.flag,
        bankNumber:e.currentTarget.dataset.item.codeid,
        codeid2:e.currentTarget.dataset.item.codeid2,
      })
      wx.navigateBack({
        delta:1
      })
      console.log(previousPage.data,22)

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    let that = this
    if(options.type){
      that.setData({
        type:options.type
      })
    }
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