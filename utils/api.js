const AppID = 'wx0c8c674ce4c354d3'
const AppSecret = '0c8c793e52092549f950fd666ca29850'
const Host = 'https://www.xxxx.com'

module.exports = {
    Host: Host,
    AppID: AppID,
    AppSecret: AppSecret,
    get(options) {
        options.method = 'GET'
        this.request(options)
    },
    post(options) {
        options.method = 'POST'
        this.request(options)
    },
    request(options) {
        let token = '';
        try {
            token = wx.getStorageSync('token');
        } catch (e) {
            // Do something when catch error
        }
        wx.request({
            url: Host + options.url,
            data: options.data,
            method: options.method,
            header: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                'XX-Token': token,
            },
            success(res) {
                console.log(res.data)
            },
            fail: function (res) {
                if (options.fail) {
                    options.fail(res)
                }
            },
            complete: options.complete ? options.complete : null
        })
    },
    login(options) {
        wx.login({
            success(res) {
                if (res.code) {
                    console.log(res)
                    //发起网络请求
                    // wx.request({
                    //     url: 'https://test.com/onLogin',
                    //     data: {
                    //         code: res.code,
                    //         avatarUrl: options.userInfo.avatarUrl,
                    //         nickName: options.userInfo.nickName,
                    //     }
                    // })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }
}