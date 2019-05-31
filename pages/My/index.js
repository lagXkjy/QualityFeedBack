// pages/My/index.js
var app = getApp();
const util = require('../../utils/util.js');
const $api = require("../../utils/api.js");
const config = require('../../config.js');
const service = config.service;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detailData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('myoptions:',options);
      let currentTab = options.currentTab;
      let index = options.index;
      console.log('dataId:', options.Id);
      this.setData({
        dataId:options.Id
      })
  },
  getData(){
    util.showLoading("获取数据ing...")
    $api.request(
      service.GetDetailDatas,
      "POST",
      {
        dataId:this.data.dataId
      },
      (res)=>{
        console.log(res);
        if(res.data.Status){
          var time = res.data.Results.Apply.replace(/[^0-9]/ig, "");
          let date = new Date(parseInt(time));
          res.data.Results.Apply = util.formatTime(date);
          let imgs = res.data.Results.Photn.split("|");
          console.log(imgs);
          res.data.Results.img = imgs;
          this.setData({
            detailData: res.data.Results
          })
        }else{
          util.showModel("获取失败",res.dada.Results)
        }
      },
      (err) => {
        util.showModel(res.statusCode,'获取错误，请稍后再试')
        console.log(err)
      },
      (res) => {
        console.log(res);
        wx.hideLoading();
      },
    )
  },
  init(){

  },
  prewImg(e){
    console.log(e.target.dataset.src);
    let img = [];
    img.push(e.target.dataset.src)
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
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
    this.getData();
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
    return {
      title: '阿特拉斯科普柯售后质量反馈',
      path: '/pages/login/login'
    }
  }
})