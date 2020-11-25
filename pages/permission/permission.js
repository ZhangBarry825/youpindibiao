// pages/permission/permission.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1, //1登录 2位置 3相册
    msg1:'请授权登录，以便使用该应用功能',
    msg2:'授权登录',
    forbidden:false
  },
  bindGetUserInfo(e) {
    // wx.openSetting()
    let that = this
    that.setData({
      forbidden:true
    })
    console.log(e.detail,'e')
    if(e.detail.rawData){
      api.login({
        ...e.detail,
        success:res=>{
          wx.showToast({
            title: '登录成功!',
            icon: 'success',
            duration: 2000
          });
          wx.setStorageSync('token',res.token)
          wx.setStorageSync('nickName',res.name)
          wx.setStorageSync('avatarUrl',res.headimg)
          setTimeout(()=>{
            wx.switchTab({
              url:'/pages/home/home'
            })
          },500)
        },
        fail(){
          that.setData({
            forbidden:false
          })
        },
        complete(){
          // that.setData({
          //   forbidden:false
          // })
        }
      })
    }else{
      that.setData({
        forbidden:false
      })
    }
  },
  bindGetSetting(e){
    console.log(e.detail.authSetting)
    let that = this
    if(e.detail.authSetting['scope.userLocation'] && that.data.type==2){
      wx.showToast({
        title: '授权成功!',
        icon: 'success',
        duration: 1000
      });
      setTimeout(()=>{
        wx.navigateBack({
          delta:1
        })
      },1000)
    }else if(e.detail.authSetting['scope.writePhotosAlbum'] && that.data.type==3){
      wx.showToast({
        title: '授权成功!',
        icon: 'success',
        duration: 1000
      });
      setTimeout(()=>{
        wx.navigateBack({
          delta:1
        })
      },1000)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type=='login'){
      this.setData({
        type:1,
        msg1:'请授权登录信息，以便使用该应用功能',
        msg2:'授权登录',
      })
    }else if(options.type=='address'){
      this.setData({
        type:2,
        msg1:'请授权位置信息，以便使用该应用功能',
        msg2:'授权位置',
      })
    }else if(options.type=='album'){
      this.setData({
        type:3,
        msg1:'请授权相册信息，以便使用该应用功能',
        msg2:'授权相册',
      })
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