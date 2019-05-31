// pages/rank/rank.js
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
    rankingData:[],
    rankingData2:[],
    tab:1
  },
  switch(e){
    console.log(Number(e.target.dataset.id));
    let id = Number(e.target.dataset.id);
    //参数：CompanyType       1:阿特拉斯积分排行  0：代理商积分排行
    this.setData({
      tab:id,
      rankingData:[]
    })
    this.requestRank(id);
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestRank(this.data.tab);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  requestRank(i){
    //console.log('length:', this.data.rankingData.length)
    let userId = wx.getStorageInfoSync('userId');
    let id =i;
    util.showLoading('获取数据ing...');
    $api.request(
      service.GetRanking,
      "POST",
      {
        userId:userId,
        CompanyType:id
      },
      (res)=>{
        console.log(service.GetRanking,res);
        if (res.data.Status) {
          let data = JSON.parse(res.data.Results)
          this.setData({
            rankingData: data
          });
        }else{
          if (res.data.Results){
            util.showModel('获取积分排名失败', res.data.Results)
          }else{
            util.showModel('提示', `错误代码：${res.statusCode},获取积分排名失败，请稍后再试`)
          }
        }
      },
      (err)=>{
        util.showModel('提示','网络异常，获取积分排名错误，请稍后再试');
      },
      (res)=>{
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    )
  },
  init(){
    this.setData({
      rankingData: []
    });
    this.requestRank(this.data.tab);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (this.data.rankingData.length) {
    //   console.log('length:',this.data.rankingData.length);
    //   return;
    // }
    //this.requestRank();
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
    // "enablePullDownRefresh": true
    console.log("下拉开始");
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