const AppID = 'wx0c8c674ce4c354d3'
const AppSecret = '0c8c793e52092549f950fd666ca29850'
const Host = 'http://192.168.1.12:8081'

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
        wx.showLoading({
            title: '加载中',
        })
        let token = '';
        try {
            token = wx.getStorageSync('token');
        } catch (e) {
            // Do something when catch error
        }
        if(options.noLogin){
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
                    if(res.data){
                        options.success(res.data);
                    }else {
                        options.success(res);
                    }

                },
                fail: function (res) {
                    if (options.fail) {
                        options.fail(res)
                    }
                },
                complete(){
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 300)
                    options.complete ? options.complete : null
                }
            })
        }else {
            wx.navigateTo({url:'/pages/permission/permission'})
        }

    },
    login(data) {
        let that = this

        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求s
                    that.request({
                        url:'/common/wxEntry',
                        noLogin:true,
                        method:'POST',
                        data:{
                            code: res.code,
                            avatarUrl: data.userInfo.avatarUrl,
                            nickName: data.userInfo.nickName,
                        },
                        success:res=>{
                            console.log(res)
                            if(res.data){
                                wx.setStorageSync('token',res.data)
                                data.success({
                                    token:res.data
                                })


                            }
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }
}