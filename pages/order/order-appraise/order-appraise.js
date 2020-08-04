// pages/order/order-appraise/order-appraise.js
const api = require('../../../utils/api.js');
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:api.Host+'/',
    message:'',
    itemDetail:{},
  },
  onScoreChange(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    this.setData({
      ['itemDetail.goodsList['+index+'].star']: e.detail,
    });
    console.log(that.data.itemDetail)
  },
  deleteImg(event){
    let itemIndex=event.currentTarget.dataset.index
    let picIndex=event.detail.index

    let itemDetail=that.data.itemDetail
    itemDetail.goodsList[itemIndex].fileList.splice(picIndex,1)
    itemDetail.goodsList[itemIndex].fileList.splice(picIndex,1)
    that.setData({
      itemDetail:itemDetail
    })
    console.log(that.data.itemDetail.goodsList[itemIndex])
  },
  afterRead(event) {
    let that = this
    let index = event.currentTarget.dataset.index
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: api.Host+'/imageUpload/upEvaluateImage', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        res.data=JSON.parse(res.data)
        console.log(res.data)
        that.setData({
          ['itemDetail.goodsList['+index+'].imageList']:that.data.itemDetail.goodsList[index].imageList.concat(res.data.data)
        })
        let newList=that.data.itemDetail.goodsList[index].fileList
        for (const fileKey in res.data.data) {
          newList.push({
            name:'',
            url:that.data.baseUrl+res.data.data[fileKey],
            isImage: true,
            deletable: true,
          })
        }
        that.setData({
          ['itemDetail.goodsList['+index+'].fileList']:newList
        })
        console.log(that.data.itemDetail.goodsList[index])
      }

    });
  },
  onTextChange(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      ['itemDetail.goodsList['+index+'].text']: e.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let commentItem=JSON.parse(wx.getStorageSync('commentItem'))
    let itemDetail={
      id:commentItem.id,
      goodsList:commentItem.orderDetailslist,
    }
    for (const apiKey in itemDetail.goodsList) {
      itemDetail.goodsList[apiKey].text=''
      itemDetail.goodsList[apiKey].imageList=[]
      itemDetail.goodsList[apiKey].fileList=[]
      itemDetail.goodsList[apiKey].star=5
    }
    this.setData({
      itemDetail:itemDetail
    })
    console.log(this.data.itemDetail)
  },
  submitForm(){
    let formData={
      orderid:this.data.itemDetail.id,
      evaluateList:this.data.itemDetail.goodsList
    }
    api.post({
      url:'/pingjia/addPingjia',
      data:{
        orderid:formData.orderid,
        evaluateList:JSON.stringify(formData.evaluateList)
      },
      success(res){
        if(res.code == 200){
          wx.showToast({
            title:'保存成功！',
            icon:'success',
            duration:1000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta:1
            })
          },1000)
        }
      }
    })
    console.log(formData)
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