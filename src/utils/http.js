const authorized = () => {
  // 和后端协商根据什么来判断是否已经登录--一般使用cookie是否有相应的字段
  return true
}

const handleNetworkError = type => {
  wx.showToast({
    title: `{${type}}: 网络出错啦。请稍后重试。`,
    icon: 'loading',
    duration: 5000,
    mask: true
  })
}

function request(url, obj = {}) {
  const data = obj.data || {}
  // 默认显示 loading
  const showLoading = obj.showLoading === false ? false : true
  const method = obj.method || 'GET'

  if (showLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }

  // 发生请求前需要执行的逻辑（这里不能是异步）
  obj.beforeSend && obj.beforeSend()

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        Accept: 'application/json',
        'Content-Type':
          method === 'GET'
            ? 'application/json' // GET 请求格式用 application/json
            : 'application/x-www-form-urlencoded' // POST 请求格式用 application/x-www-form-urlencoded
      },
      success(res) {
        // 返回数据
        resolve(res.data)

        // 当前接口是否需要登录，如果需要登录并且当前处于未登录状态跳转登录页
        // 跟后端协商好需要登录的接口返回的字段是什么
        if (res.data.status === 10001 && !authorized()) {
          // 跳转登录页
          wx.redirectTo({
            url: '/pages/login'
          })
        }

        // 如果需要对接口的异常弹窗提示移可以写在这里
      },
      fail(res) {
        reject(res)
      },
      complete(res) {
        console.log(res)
        wx.hideLoading()

        // 是否需要做404错误拦截
        if (res.statusCode === 404) {
          handleNetworkError('complete 404')
        }
      }
    })
  })
}

const get = url => {
  return request(url)
}

const fetch = url => {
  return request(url)
}

const post = (url, obj) => {
  return request(url, obj)
}

export default {
  request,
  get,
  fetch,
  post
}

// 使用
// $http('/api/users', {
//   data: {
//     name: 'jone',
//     age: 14
//   }
// }).then(res => {})
// .catch(error => {})
