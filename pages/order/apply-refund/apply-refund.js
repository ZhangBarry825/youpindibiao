// pages/order/apply-refund/apply-refund.js
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundCount:'',
    refundReason:'',
    orderid:'',
    payNum:0,//实际支付金额（去除快递费）
    fileList: [],
    imgList:[],
    reasonList:[],//原因列表
    showReason:false,
    columns: [],
    reasonValue:'',
    reasonText:'选择退货原因',
  },
  onReasonChange(event) {

  },
  onReasonConfirm(event){
    let that = this
    const { picker, value, index } = event.detail;
    console.log(index)
    console.log(that.data.reasonList[index])
    that.setData({
      reasonValue:that.data.reasonList[index].id,
      reasonText:that.data.reasonList[index].reasonName,
      showReason:false
    })
  },
  showReason(){
    this.setData({
      showReason:true
    })
  },
  hideReason(){
    this.setData({
      showReason:false
    })
  },
  deleteImg(event){
    console.log(event.detail.index)
  },
  afterRead(event) {
    let that = this
    const { file } = event.detail;
    console.log(file,'file')
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: api.Host+'/imageUpload/upReturnImage', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      formData: { },
      success(res) {
        // 上传完成需要更新 fileList
        res= JSON.parse(res.data)
        console.log(res)
        let fileList=that.data.fileList
        let imgList=[]
        for (const eventKey in res.data) {
          fileList.push({
            name:'',
            url: api.Host+'/'+res.data[eventKey],
            isImage: true,
            deletable: true,
          });
          imgList.push(res.data[eventKey])
        }
        that.setData({
          fileList:fileList,
          imgList:imgList
        });
      },
    });
  },
  refundCountChange(e){
    this.setData({
      refundCount:e.detail
    })
  },
  refundReasonChange(e){
    this.setData({
      refundReason:e.detail
    })
  },
  submitForm(){
    let that = this
    let formData={
      orderid:that.data.orderid,
      reasonid:that.data.reasonValue,
      goodsMoney:that.data.refundCount,
      remarks:that.data.refundReason,
      imageList:that.data.imgList
    }
    console.log(formData.goodsMoney,typeof formData.goodsMoney)
    console.log(that.data.payNum,typeof that.data.payNum)
    if(formData.orderid==''||formData.reasonid==''||formData.goodsMoney==''){
      wx.showToast({
        title:'请检查填写退货原因和退款金额',
        icon:'none',
        duration:1000
      })
    }else if(parseFloat(formData.goodsMoney)>parseFloat(that.data.payNum)){
      wx.showToast({
        title:'退款金额不能大于'+that.data.payNum+'元',
        icon:'none',
        duration:1000
      })
    }else {
      api.post({
        url:'/returnGoods/addReturnGoods',
        data:formData,
        success(res){
          if(res.code == 200&&res.message=='申请售后成功'){
            wx.showToast({
              title:'提交成功！',
              icon:'success',
              duration:1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta:1
              })
            },1000)
          }else {
            wx.showToast({
              title:'提交异常或已提交过退货申请',
              icon:'none',
              duration:1000
            })
          }
        }
      })
    }


  },
  fetchData(){
    let that = this
    api.post({
      url:'/returnGoods/returnReasonList',
      data:{},
      success(res){
        if(res.code == 200){
          let columns=[]
          for (const Key in res.data) {
            columns.push(res.data[Key].reasonName)
          }
          console.log(columns,'columns')
          that.setData({
            columns:columns,
            reasonList:res.data,
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
    let payNum=options.payNum
    this.setData({
      orderid:orderid,
      payNum:payNum
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