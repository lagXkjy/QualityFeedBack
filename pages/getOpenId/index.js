// pages/newindex/index.js
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: wx.getStorageSync("avatarUrl"),
    nickName: wx.getStorageSync("nickName"),
    integral: null,
  },

  JiLu: function () {
    wx.navigateTo({
      url: '../Integral/index',
    })
  },
  pian: function () {
    wx.navigateTo({
      url: '../feedback/index',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId();
    
  },
  getOpenId() { //获取openid
    let openid = wx.getStorageSync('openid');
    if (openid == null || openid == '') {
      util.getOpenId(null, () => {
        this.getOpenId();
        
      }); //获取用户信息及openid；
      return;
    }
  },
  init: function () {
    util.showLoading('努力加载中...')
    $api.request(
      service.feedBackDataUrl,
      "POST",
      {
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        app.data.integral = res.integral;
        app.data.feedBackData = res.feedBackData;
        console.log(app.data)
        this.setData({
          integral: res.integral
        })
      },
      (err) => {
        console.log(err);
      },
      (res) => {
        wx.hideLoading();
      }

    )

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init();
  },
  // 照片上传

  Pian: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(wx.getStorageSync('openid'))
  },
  login: function () {

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
    console.log("newIndex refresh");
    this.init();

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
    return {
      title: '阿特拉斯科普柯售后质量反馈',
      path: '/pages/login/login'
    }
  }
})