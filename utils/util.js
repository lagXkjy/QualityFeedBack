let config = require('../config.js');
let $api = require('api.js');
let service = config.service;
let app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();
    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var showLoading = (title)=>{
  wx.showLoading({
    title: title,
    mask: true,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}
//获取openid以及个人头像等信息
const wxGetUserInfo = function (callback) {
  wx.login({
    complete: (res) => {
      if (res.code) {
        let code = res.code;
        //发请求
        $api.request(
          service.getSaveUserOpenId,
          'POST',
          {
            code: code
          },
          (res) => {
            console.log("openidcucces:", res)
            // if (res.data) {
            //   //保存openid
            //   wx.setStorageSync('openid', res.data.openid);
            //   console.log("openid:" + wx.getStorageSync('openid'))
            //   //保存用户类型
            //   wx.setStorageSync('userType', res.data.userType);
            //   callback();
            // }
          },
          (err) => {
            wx.showModal({
              title: '提示',
              content: '亲~网络不给力哦，请稍后重试',
              showCancel: false,
            })
          },
          (res)=>{
            console.log(res)
          }
        );
      } else {
        wx.showModal({
          title: '提示',
          content: '获取信息失败',
          showCancel: false,
        })
      }
    }
  })
}
const uploadFiles = function (types = 'image', files, userId, callback) {
  let filePaths = '';
  console.log(files);
  console.log(userId)
  for (let i in files) {
    // (function(i){
    wx.uploadFile({
      url: service.uploadImgsUrl,
      filePath: files[i],
      name: 'file',
      formData: {
        userId: userId
      },
      success: (res) => {
        filePaths += `${files[i]},`;
        //console.log(filePaths)
        if (i == files.length - 1) {
          //filePaths = filePaths.substr(0, filePaths.length-1)
          console.log(filePaths);
          console.log(app.data);
          if (types == 'image') {
            app.data.Imgs = filePaths
          } else if (types = 'video') {
            app.data.Video = filePaths
          }
          callback();
        }
      },
      fail: (err) => {
        console.log(err)
      },
      complete: (res) => {
        console.log(res)
      }
    });
    //})(i)

  }

}
const uploadImgs = (files, userId)=> {
  let length = files.length;
  let count = 0;
  let filePaths = '';
  return uploadFile();
}
const uploadFile = ()=> {
  console.log(userId)
  wx.uploadFile({
    url: service.uploadImgsUrl,
    filePath: files[count],
    name: 'file',
    formData: {
      userId: userId
    },
    success: (res) => {
      // if (res.path) {
      //   filePaths += res.path+",";
      //   if (count == length - 1) {
      //     filePaths += res.path
      //   }
      // }; 

      filePaths += `${files[count]},`;
      //console.log(count,files[count])
      if (count == length - 1) {
        //filePaths += `${files[count]}`
        filePaths = filePaths.substring(0, filePaths.length - 1)
        console.log(filePaths)
      } else {
        // filePaths += `${files[count]},`;
      }
      if (count == length - 1) {
        //filePaths += `${files[count]}`
        filePaths = filePaths.substring(0, filePaths.length - 1)
        console.log(filePaths)
      }
      count++;
      uploadFile();

    },
    fail: (err) => {
      console.log(err)
    },
    complete: (res) => {
      console.log(res);

    }
  })
}
//获取openid
const getOpenid = function (callback) {
  callback = typeof (callback) === 'function' ? callback : function (res) { };
  let openid = wx.getStorageSync('openid');
  if (openid) return;
  wx.login({
    complete: (res) => {
      if (res.code) {
        let code = res.code;
        console.log("code:",code);
        showLoading('努力加载ing....');
        $api.request(
          service.getSaveUserOpenId,
          "POST",
          {
            code: code
          },
          (res) => {
            console.log(service.getSaveUserOpenId, res);
            console.log('code',code)
            if(res.statusCode == 200){
              //showModel('getSaveUserOpenId', res.data.Results);
              wx.setStorageSync('openid', res.data.Results.openid);
              wx.setStorageSync('userId', res.data.Results.userId);
              wx.setStorageSync('integral', res.data.Results.totalIntegral);
              if (res.data.Status) {
                //用户存在
                callback();
              }else{
                //用户不存在
                //showModel("获取openid失败,请稍后再试", res.data.Results)
              }
            }else{
              showModel("GetOpenId", `${res.statusCode},网络错误,请稍后再试`);
            }
            
          },
          (err) => {
            //showModel("网络异常", '请稍后再试');
            console.log("err:",err)
            showModel('网络异常,请稍后再试',err)
          },
          (res) => {
            wx.hideLoading();
          }
        );
      }
    }
  })
}
//获取并更新用户头像等信息
const getUserInfo = function (userInfo, callback) {
  callback = typeof (callback) === 'function' ? callback : function (res) { };
  wx.setStorageSync('userInfo', userInfo);
  console.log(userInfo);
  wx.request({
    url: config.UpdateAvaUrlNick,
    data: {
      openId: wx.getStorageSync('openid'),
      avaUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
    },
    header: { 'content-type': 'application/json' },
    method: 'POST',
    success: (res) => {
      if (res.data.res) {
        callback();
      }
    }
  });
}
//获取位置设置信息
const GetSetting = (init,refused)=>{
  init = typeof (init) === 'function' ? init : function (res) { };
  refused = typeof (refused) === 'function' ? refused : function (res) { };
    wx.getSetting({
      success: (res) => {
        console.log(res);
        console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取地址',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");
                refused();
              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })
                      //再次授权，调用getLocationt的API
                      //allowed();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 2000
                      });
            
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == true){
          init();
        }
        else if (res.authSetting['scope.userLocation'] == undefined) {
          //初始化进入
          init();
        }
      }
    })
}
const GetLocation = (success,fail)=>{
  success = typeof (success) === 'function' ? success : function (res) { };
  fail = typeof (fail) === 'function' ? fail : function (res) { };
  wx.getLocation({
    type: 'wgs84',
    success:success,
    fail:fail
  })
}

module.exports = {
  formatTime,
  formatDate,
  showBusy,
  showSuccess,
  showModel,
  showLoading,
  getOpenId: getOpenid,
  getUserInfo: getUserInfo,
  uploadFiles,
  uploadImgs,
  GetSetting,
  GetLocation
}
