// pages/myshop/shop-apply/shop-apply.js
import {checkPhone} from "../../../utils/util";
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

const api = require('../../../utils/api.js');
import areaFile from '../../../utils/area'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressArea: '',
    addressDetail: '',
    userName: '',
    phone: '',
    code: '',
    showSelect: false,

    areaList: {
      ...areaFile
    }
  },
  onAddressDetailChange(e) {
    this.setData({
      addressDetail: e.detail
    })
  },
  onUserNameChange(e) {
    this.setData({
      userName: e.detail
    })
  },
  onPhoneChange(e) {
    this.setData({
      phone: e.detail
    })
  },
  onCodeChange(e) {
    this.setData({
      code: e.detail
    })
  },
  selectArea(e) {
    console.log(e.detail.values)
    this.setData({
      showSelect: false,
      addressArea: e.detail.values[0].name + e.detail.values[1].name + e.detail.values[2].name
    })
  },
  openSelect() {
    this.setData({
      showSelect: true
    })
  },
  onCloseSelect() {
    this.setData({
      showSelect: false
    })
  },

  onDefaultCheckedChange({detail}) {
    // 需要手动对 checked 状态进行更新
    this.setData({defaultChecked: detail});
  },
  submitForm() {
    let that = this
    console.log(this.data.addressArea)
    console.log(this.data.addressDetail)
    console.log(this.data.userName)
    console.log(this.data.phone)
     if (this.data.userName == '') {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.phone == '' || !checkPhone(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.addressArea == '') {
       wx.showToast({
         title: '请选择省市区',
         icon: 'none',
         duration: 1000
       })
     } else if (this.data.addressDetail == '') {
       wx.showToast({
         title: '请输入详细地址',
         icon: 'none',
         duration: 1000
       })
     } else {
      api.post({
        url: '/businessApply/toShopApply',
        data: {
          shopAddress: that.data.addressArea + that.data.addressDetail,
          shopName: that.data.userName,
          shopTel: that.data.phone,
        },
        success(res) {
          console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: '提交成功！',
              icon: 'success',
              duration: 1000
            })
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];  //上一个页面
            setTimeout(() => {
              prevPage.fetchData()
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    let id = options.id
    if (id) {
      this.setData({
        id: id
      })
      this.fetchData()
    }

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