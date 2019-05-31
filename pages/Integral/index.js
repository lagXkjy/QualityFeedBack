// pages/Integral/index.js
let app = getApp();
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
let pageIndex = 0;
const pageSize = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      integral:null,
      integralData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  init:function(){
    pageIndex = 0;
    this.setData({
      integral:wx.getStorageSync('integral'),
      integralData:app.data.feedBackData[1]
    });
    this.getData();
  },
  getData: function () {
    var that = this;
    wx.showLoading({ title: '信息获取中' });
    console.log(pageIndex)
    $api.request(
      service.GetIntegralRecord,
      "POST",
      {
        userId: wx.getStorageSync('userId'),
        pageIndex:pageIndex,
        pageSize:pageSize
      },
      (res) => {
        console.log(service.GetIntegralRecord,res);
        if(res.data.Status){
          pageIndex++;
          let integral = res.data.Results.TotalIntegral;
          wx.setStorageSync('integral',integral);
          let data = res.data.Results.IntegralDetails;
          data.forEach((item, k) => {
            console.log(item);
            let Apply = item.CreateTime.replace(/[^0-9]/ig,"");
            console.log(Apply)
            Apply = util.formatTime(new Date(parseInt(Apply)));
            item.Apply = Apply
          });
          console.log("data:",data)
          app.data.integralData = app.data.integralData.concat(data);
          this.setData({
            integralData: app.data.integralData,
            integral: integral
          });
        }else{
          util.showModel("获取失败",res.data.Results);
        }
        console.log('app.data.integralData', app.data.integralData);
        wx.hideLoading();
      },
      (err) => {
        console.log(err);
        util.showModel("获取数据错误",`${err.statusCode},请稍后再试`)
      },
      (res) => {
        console.log("complete:", res)
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    )
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
    app.data.integralData = []
    this.init();
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
      console.log('下拉刷新')
      pageIndex = 0;
      app.data.integralData = [];
      this.setData({
        integralData: app.data.integralData
      })
     this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载更多');
    this.getData();
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