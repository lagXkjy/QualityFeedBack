// pages/login/login.js
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
let service = common.service;
let countdown = 60;
let code
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    canGetVerify:false,//是否可以获取验证码
    getted:false,
    time:60,
    show:true,
    phone:null,
    verify:null,
  },
  settime:function(){
    var that=this
    if (countdown == 0) {
     that.setData({
       show: true,
       getted: false,
       verify:null,
       canGetVerify: true
     })
      countdown = 60;
     return
    } else {
      countdown--;
      that.setData({
        show: false,
        time: countdown
      })
    }
   var pp= setTimeout(function () {
      that.settime()
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
    this.getOpenId();
  },
  init:function(){
    this.setData({
      hidden: true,
      getVerify: false,//是否可以获取验证码
      time: 60,
      show: true
    })
  },
  getOpenId() { //获取openid
    var that = this;
    let openid = wx.getStorageSync('openid');
    let userId = wx.getStorageSync('userId');
    console.log("openid:", openid);
    if (openid === null || openid === '') {
      console.log("首次进入没有openid:", openid);
      util.getOpenId(function () {
        console.log("没有openid请求之后且拿到userId,openid:", wx.getStorageSync('openid'));
        wx.switchTab({
          url: '../newindex/index',
        })
      });
      return;
    }
    if (userId) {
      console.log("直接拿到userId:", userId)
      wx.switchTab({
        url: '../newindex/index',
      })
    }
    console.log("首次进入有openid:", openid);
  },
  //提交且之前获取用户信息
  getUserInfo(e){
    let userInfo = e.detail.userInfo;
    let phone = this.data.phone;
    let verify = this.data.verify;
    let verifyInp = this.data.verifyInp;
    let openid = wx.getStorageSync('openid');
    console.log(userInfo);
    if(!userInfo){return};
    if(!verify){
      util.showModel('', '请先获取验证码');
      return;
    }
    if(!verifyInp){
      util.showModel('','请输入验证码');
      return;
    }
    if (verifyInp != verify){
      console.log(verifyInp,'--', verify)
      util.showModel('', '亲~验证码错误');
      return;
    }
    util.showLoading('提交认证ing...');
    console.log("submitData:",{
      phone: phone,
      openid: openid,
      nickName: userInfo.nickName,
      avaUrl: userInfo.avatarUrl
    })
    $api.request(
      service.loginUrl,
      "POST",
      {
        phone: phone,
        openid:openid,
        nickName:userInfo.nickName,
        avaUrl: userInfo.avatarUrl
      },
      (res) => {
        console.log(service.loginUrl,res)
        if (res.data.Status) {
          wx.setStorageSync('userId',res.data.Results.UserId);
          wx.setStorageSync('integral', res.data.Results.totalIntegral)
          wx.switchTab({
            url: '../newindex/index',
          })
        }else{
          util.showModel('提交信息失败',res.data.Results)
        }
      },
      (err) => {
        console.log(err);
        util.showModel('提交错误', '请稍后再试')
      },
      (res) => {
        console.log(res);
        wx.hideLoading();
        this.setData({

        })
      }
    )
    
  },
 
  verifyInp(e){
    console.log(e.detail.value);
    this.setData({
      verifyInp: e.detail.value
    });
  },
  //手机号输入
  phoneInp(e){
    let phone = e.detail.value;
    this.setData({
      canGetVerify: false,
      phone:phone
    })
    if(e.detail.value.length == 11){
      console.log("11");
      let reg = /^1[0-9]{10}$/;
      if(reg.test(phone)){
        this.setData({
          canGetVerify:true
        })
      }
    }
  },
  // 获取验证码
  HuoQuma:function(){
    var that=this;
    if(this.data.canGetVerify){
      util.showLoading('获取验证码ing...')
      console.log(service);
      console.log("to-verify-phone:",this.data.phone)
      $api.request(
        service.verifyUrl,
        'POST',
        {
          phone:Number(this.data.phone)
        },
        (res)=>{
          console.log(res);
          if(res.data.Status){
            this.setData({
              verify:res.data.Results
            });
            that.settime();
          }else{
            util.showModel('验证码获取失败',res.data.Results)
          }
          
        },
        (err) => {
          util.showModel('验证码获取错误', '请稍后再试');
        },
        (res) => {
          console.log(res);
          wx.hideLoading();
        }
      )
    }else{
      util.showModel("手机号未输入", "亲~请输入正确手机号");
    }
      
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
      return{
          title:'阿特拉斯科普柯售后质量反馈',
          path:'/pages/login/login'
      }
  }
})