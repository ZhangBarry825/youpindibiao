// pages/live-room/live-room/live-room.js
import {formatTime} from "../../../utils/util";

const api = require('../../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomList: [],
        pageNum: 1,
        pageSize: 6
    },
    goCreate() {
        wx.navigateTo({
            url: '/pages/live-room/create-room/create-room'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchData()
    },
    fetchData(pageNum = 1, append = false) {
        wx.hideLoading()
        wx.showLoading({
            title: '加载中',
        })
        const that = this
        //获取直播间列表
        api.post({
            url: '/live/getLiveList',
            data: {
                "start": (pageNum - 1) * that.data.pageSize, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
                "limit": that.data.pageSize // 每次拉取的个数上限，不要设置过大，建议 100 以内
            },
            success(res2) {
                console.log(res2.data.room_info, 234)

                if (res2.data.room_info.length > 0) {
                    for (const key in res2.data.room_info) {
                        res2.data.room_info[key].start_time = formatTime(res2.data.room_info[key].start_time)
                        res2.data.room_info[key].end_time = formatTime(res2.data.room_info[key].end_time)
                    }
                    if (append) {
                        that.setData({
                            roomList: that.data.roomList.concat(res2.data.room_info),
                            pageNum: pageNum
                            //直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期
                        })
                    } else {
                        that.setData({
                            roomList: res2.data.room_info
                            //直播间状态。101：直播中，102：未开始，103已结束，104禁播，105：暂停，106：异常，107：已过期
                        })
                    }
                } else {
                    wx.showToast({
                        title: '暂无更多！',
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            complete() {
                wx.hideLoading()
            }
        })
    },
    goToLiveRoom(e) {
        let roomId = e.currentTarget.dataset.roomid
        let customParams = encodeURIComponent(JSON.stringify({path: 'pages/index/index', pid: 1}))
        wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
        })
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
        this.setData({
            roomList: [],
            pageNum: 1
        })
        this.fetchData()
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 1000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.fetchData(this.data.pageNum + 1, true)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})