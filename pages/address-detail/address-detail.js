// pages/address-detail/address-detail.js
import {checkPhone} from "../../utils/util";
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

const api = require('../../utils/api.js');
import areaFile from '../../utils/area'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        addressArea: '',
        addressDetail: '',
        userName: '',
        phone: '',
        code: '',
        defaultChecked: true,
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
        console.log(this.data.code)
        console.log(this.data.defaultChecked)
        if (this.data.addressArea == '') {
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
        } else if (this.data.userName == '') {
            wx.showToast({
                title: '请输入收货人姓名',
                icon: 'none',
                duration: 1000
            })
        } else if (this.data.phone == '' || !checkPhone(this.data.phone)) {
            wx.showToast({
                title: '请输入正确手机号码',
                icon: 'none',
                duration: 1000
            })
        } else if (this.data.code == '') {
            wx.showToast({
                title: '请输入邮编',
                icon: 'none',
                duration: 1000
            })
        } else {
            let url = ''
            let formData = {}
            that.data.id ? url = '/user/updateAddressByAddrId' : url = '/user/insertAddress'
            if (that.data.id) {
                formData = {
                    addressid: that.data.id,
                    address: that.data.addressArea,
                    xqaddress: that.data.addressDetail,
                    name: that.data.userName,
                    zipcode: that.data.code,
                    tel: that.data.phone,
                    isdefault: that.data.defaultChecked ? 'y' : 'n'
                }
            } else {
                formData = {
                    address: that.data.addressArea,
                    xqaddress: that.data.addressDetail,
                    name: that.data.userName,
                    zipcode: that.data.code,
                    tel: that.data.phone,
                    isdefault: that.data.defaultChecked ? 'y' : 'n'
                }
            }

            api.post({
                url: url,
                data: formData,
                success(res) {
                    console.log(res)
                    if (res.code == 200) {
                        wx.showToast({
                            title: '保存成功！',
                            icon: 'success',
                            duration: 1000
                        })
                        var pages = getCurrentPages();
                        var currPage = pages[pages.length - 1];   //当前页面
                        var prevPage = pages[pages.length - 2];  //上一个页面
                        setTimeout(() => {
                            prevPage.fetchData()
                            wx.navigateBack({
                                delta: -1
                            })
                        }, 1000)
                    }
                }
            })
        }
    },
    fetchData() {
        let that = this
        api.post({
            url: '/user/selectAddressById',
            data: {
                addressId: that.data.id
            },
            success(res) {
                if (res.data.isdefault == 'y') {
                    res.data.isdefault = true
                } else {
                    res.data.isdefault = false
                }
                that.setData({
                    addressArea: res.data.address,
                    addressDetail: res.data.xqaddress,
                    userName: res.data.name,
                    phone: res.data.tel,
                    code: res.data.zipcode,
                    defaultChecked: res.data.isdefault,
                })
                console.log(res)
            }
        })
    },
    deleteForm() {

        let that = this
        Dialog.confirm({
            title: '提示',
            message: '确认删除吗？',
        }).then(() => {
            api.post({
                url: '/user/removeAddress',
                data: {
                    addressId: that.data.id
                },
                success(res) {
                    if (res.code == 200) {
                        wx.showToast({
                            title: '删除成功！',
                            icon: 'success',
                            duration: 1000
                        })
                        var pages = getCurrentPages();
                        var currPage = pages[pages.length - 1];   //当前页面
                        var prevPage = pages[pages.length - 2];  //上一个页面
                        setTimeout(() => {
                            prevPage.fetchData()
                            wx.navigateBack({
                                delta: -1
                            })
                        }, 1000)

                    }
                }
            })
        })
            .catch(() => {
                // on cancel
            });
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