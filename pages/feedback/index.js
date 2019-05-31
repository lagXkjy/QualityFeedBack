// pages/feedback/index.js
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
var app = getApp();
let pageIndex = 0;
let notPageIndex = 0;
const pageSize = 20;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['待确认', '已采用'],//, '未采用'
    currentTab: 0,
    feedBackData:[],
    waitDatas:[],
    hasDatas:[],
    notDatas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.data.feedBackData[1] = [];
  },
  init(){
    util.showLoading('努力加载中...');
    this.setData({
      currentTab: 0
    })
    this.getData();
  },
  navbarTap: function (e) {
    var that = this;
    let currentTab = e.target.dataset.idx;
    that.setData({
      currentTab: currentTab,
    });
    pageIndex = 0;
    notPageIndex = 0;
    app.data.feedBackData[currentTab] = [];
    this.getData();
  },
  getData: function () {
    var that = this;
    let currentTab = this.data.currentTab;
    let userId = wx.getStorageSync('userId');
    let url = service.GetFeedBackDatas;
    let data = {
      userId: userId
    };
    data.dataIndex = currentTab;
    //app.data.feedBackData[currentTab] = [];
    switch (currentTab) {
      case 0:
        break;
      case 1:
        //url = service.GetHasAcceptDatas;
        data.pageIndex = pageIndex;
        data.pageSize = pageSize;
        break;
      case 2:
        //url =  service.GetNotAcceptDatas;
        data.pageIndex = notPageIndex;
        data.pageSize = pageSize;
        break;
      default:
        break;
    }
    wx.showLoading({ title: '信息获取中' });
    console.log("url:", url)
    console.log("getData-request-data:",data);
    
    $api.request(
      url,
      "POST",
      data,
      (res) => {
        console.log(res)
        //console.log(app.data);
        if(res.data.Status){
          //时间转换
          res.data.Results.map(function (item) {
            console.log(item.Apply);
            //item.applyTime = util.formatTime(item.applyTime)
            var time = item.Apply.replace(/[^0-9]/ig, "");
            let date = new Date(parseInt(time));
           item.Apply = util.formatTime(date);
          })
          app.data.feedBackData[currentTab] = app.data.feedBackData[currentTab].concat(res.data.Results);
        }else{
          util.showModel('获取数据失败',res.data.Results)
        }
        that.setData({
          feedBackData: app.data.feedBackData
        })
        if(currentTab == 1){
          pageIndex++;
        }
        if (currentTab == 2) {
          notPageIndex++;
        }
        
      },
      (err) => {
        console.log(err);
        util.showModel('获取数据错误', `${res.status},网络错误，请稍后再试`)
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
    pageIndex = 0;
    app.data.feedBackData[0] = [];
    app.data.feedBackData[1] = [];
    app.data.feedBackData[2] = [];
    this.getData();
  },
  goToMy:function(options){
      console.log(options.target.dataset)
      let currentTab = this.data.currentTab;
      let index = options.target.dataset.index;
      let id = options.target.dataset.id;
      wx.navigateTo({
        url: `../My/index?currentTab=${currentTab}&index=${index}&Id=${id}`,
      })
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
    app.data.feedBackData[0] = [];
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.currentTab == 0){return};
    this.getData();
  },
  onShareAppMessage: function () {
    return {
      title: '阿特拉斯科普柯售后质量反馈',
      path: '/pages/login/login'
    }
  }
})