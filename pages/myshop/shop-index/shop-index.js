// pages/mine-shop/mine-shop.js
import {formatTime} from "../../../utils/util";
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog";

const api = require('../../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: api.Host + '/',
        status: -1,//店铺状态  -1未申请 0审核中 1已通过 2未通过
        reason: '',
        shopInfo: {},
        confirmTime: '',
        addressData: {
            lat: '',
            lng: '',
        }
    },
    fetchData() {
        let that = this
        api.post({
            url: '/businessApply/queryShopState',
            data: {},
            success(res) {
                if (res.code == 200) {
                    res.data.state = parseInt(res.data.state)
                    that.setData({
                        status: res.data.state
                    })
                    if (res.data.yujiTime) {
                        that.setData({
                            confirmTime: formatTime(res.data.yujiTime)
                        })
                    }
                    if (res.data.weisha) {
                        that.setData({
                            status: res.data.state,
                            reason: res.data.weisha,
                        })
                    }
                    console.log(that.data.status, 'status')
                }
            }
        })
        api.post({
            url: '/myShop/toIndex',
            data: {},
            success(res) {
                if (res.code == 200) {
                    that.setData({
                        shopInfo: res.data
                    })
                }
            }
        })
    },
    goApply() {
        wx.navigateTo({
            url: '/pages/myshop/shop-apply/shop-apply'
        })
    },
    goTo(e) {
        let path = e.currentTarget.dataset.path
        wx.navigateTo({
            url: path
        })
    },
    getLocation(callback) {
        let that = this
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                const latitude = res.latitude
                const longitude = res.longitude
                const speed = res.speed
                const accuracy = res.accuracy  //位置精确度
                that.setData({
                    addressData: {
                        lat: latitude,
                        lng: longitude,
                    }
                })
                callback({
                    lat: latitude,
                    lng: longitude,
                })
            },
            fail() {
                Dialog.confirm({
                    title: '提示',
                    message: '请授权位置信息，以便申请店铺地理位置',
                }).then(() => {
                    wx.navigateTo({
                        url: '/pages/permission/permission?type=address'
                        // on cancel
                    })
                });
            }
        })
    },
    getPhoneNumber(callback) {
        let token = wx.getStorageSync('token')
        api.post({
            url:'/user/selectUserById',
            data:{
                token:token
            },
            success(res){
                if(res.code == 200){
                    console.log(res,88888)
                    if(res.data.tel){
                        callback(res.data.tel)
                    }else {
                        callback('')
                        // wx.showToast({
                        //     title:'请先填写个人资料中手机号',
                        //     icon:'none',
                        //     duration:2000
                        // })
                        // setTimeout(()=>{
                        //     wx.navigateTo({
                        //         url:'/pages/edit-userInfo/edit-userInfo'
                        //     })
                        // },1000)

                    }
                }
            }
        })
    },
    authorizePass(e) {
        let that = this
        let shopName = wx.getStorageSync('nickName') + '的店铺'
        that.getPhoneNumber((res1) => {
            console.log('获取手机号', res1)
            that.getLocation((res2) => {
                console.log('获取位置信息', res2)
                //TODO
                api.post({
                    url: '/businessApply/toShopApply',
                    data: {
                        shopAddress: '',
                        shopName: shopName,
                        userName: res1,
                        shopTel: res1,
                        lat:res2.lat,
                        lng:res2.lng,
                    },
                    success(res) {
                        //console.log(res)
                        if (res.code == 200) {
                            wx.showToast({
                                title: '提交成功！',
                                icon: 'success',
                                duration: 1000
                            })
                           that.fetchData()
                        }
                        // else if(res.code == 500 && res.message=='店铺名重复，请重新输入'){
                        //     wx.showToast({
                        //         title: '店铺名已存在，请修改昵称',
                        //         icon: 'none',
                        //         duration: 2000
                        //     })
                        //     setTimeout(()=>{
                        //         wx.navigateTo({
                        //             url:'/pages/edit-userInfo/edit-userInfo'
                        //         })
                        //     },1000)
                        // }else if(res.code == 500 && res.message=='该手机号已存在，请更换其他账号'){
                        //     wx.showToast({
                        //         title: '该手机号已存在，请更换其他手机号',
                        //         icon: 'none',
                        //         duration: 2000
                        //     })
                        //     setTimeout(()=>{
                        //         wx.navigateTo({
                        //             url:'/pages/edit-userInfo/edit-userInfo'
                        //         })
                        //     },1000)
                        // }
                        else {
                            wx.showToast({
                                title: '提交失败，请稍后重试！',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    }
                })
            })
        })
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
        this.fetchData()
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