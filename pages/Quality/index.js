// pages/Quality/index.js
let util = require('../../utils/util');
let common = require('../../config');
let $api = require('../../utils/api');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
let service = common.service;
let countdown = 60;
let limit = 30;//提交限制时间-秒
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    department: [],
    agent: [],
    press: [],//压力
    types: [],//机型
    serialNum: null,
    description: '',
    troublesBigPick: [],
    troublesLitPick: [],
    pressNotChecked: true,
    typesNotChecked: true,
    depNotChecked: true,
    brandNotChecked: true,
    agentNotChecked: true,
    depIndex: null,
    typeIndex: null,
    pressIndex: null,
    bigIndex: null,
    imgChoosed: false,
    vedioChoosed: false,
    canGetVerify: false,//是否可以获取验证码
    getted: false,
    time: 60,
    show: true,
    phone: '',//手机
    verify: null,//验证码
    showImgs: [],
    addres: '',
    showPhoneInp: true,
    userShow: true,
    video:"",
    canSubmit:true,
    location:'',
    chooses:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // ;
    //this.init();
    this.setDate();
    this.getOpenId();
    qqmapsdk = new QQMapWX({
      key: 'C3RBZ-B2XCG-C2GQX-IQYSW-CGF2H-JNBGT'
    });
  },
  navToVideo() {
    wx.navigateTo({
      url: '../video/video',
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
        if (wx.getStorageSync('status')) {
          that.setData({
            showPhoneInp: false,
            userId: wx.getStorageSync('userId')
          })
        }
      });
      return;
    }
    if (userId) {
      console.log("直接拿到userId:", userId);
    }
    console.log("首次进入有openid:", openid);
    console.log("userType:", wx.getStorageSync('userType'));
  },
  setDate: function () {
    let date = new Date();
    var today = util.formatDate(date);
    this.setData({
      today: today
    })
  },
  setLocation(lat,lon){
    var that = this;
    let location = this.data.location;
    // let latitude = wx.getStorageSync('latitude');
    // let longitude = wx.getStorageSync('longitude');
    // if(latitude && longitude){
    //   return;
    // };
    if(location){
      return;
    }
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lon
      },
      coord_type: 1,
      success: function (res) {
        console.log('location:', res);
        if (res.status == 0) {
          //地址解析成功
          that.setData({
            location: res.result.address,
            city:res.result.address_component.city
          });
          console.log('that.data.location',that.data.location)
        } else {
          //地址解析失败
          util.showModel('提示',`地图逆解析地址失败，错误状态码：${res.status}`)
        }
      },
      fail: function (res) {
        util.showModel('提示', '网络异常，无法逆解析地址，请稍后再试')
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  settime: function () {
    var that = this
    if (countdown == 0) {
      that.setData({
        show: true,
        getted: false,
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
    var pp = setTimeout(function () {
      that.settime()
    }, 1000)
  },
  //初始化
  init: function () {
    
  },
  //设置pickers
  getPickers: function () {
    var that = this;
    //wx.showLoading({ title: '信息获取中' });
    var i = 0;
    let count = 0;
    let pickers = [
      service.getDepartment,
      service.getPress,
      service.getBigTroubles,
      service.GetTroubleShooting//故障处理
    ];
    //,service.getTroubleBody
    util.showLoading('获取数据ing...');
    picker();
    function picker() {
      console.log(i);
      console.log(pickers[i]);
      
      $api.request(
        pickers[i],
        "POST",
        {},
        (res) => {
          //console.log(`${pickers[i]}datas:`,res);
          if (res.data.Status) {
            let data = JSON.parse(res.data.Results)
            switch (i) {
              case 0://部门
              console.log("deparment:",data)
                that.setData({
                  department: data
                });
                break;
              // 机型
              // case 1:
              //   console.log("types:", data)
              //   that.setData({
              //     types: data
              //   })
              //   break;
              case 1:// 压力
                console.log("press:", data)
                that.setData({
                  press: data
                });
                break; 
              case 2:// 故障大类
                console.log("bigTroubles:", data)
                that.setData({
                  troublesBigPick:data
                })
                break;
              case 3://故障处理
                console.log("TroublesShhooting:", data)
                that.setData({
                  troublesShooting: data
                })
                break;
              default:
                break;
            }
          }
          if (i == pickers.length - 1) { return }
          i++;
          picker();
        },
        (err) => {
          util.showModel(err.statusCode || '获取失败', "获取选择信息失败，请稍后再来")
        },
        (res) => {
          // if(i == pickers.length-1){return};
          // i++;
          // this.picker(pickers,i);
          if (count == pickers.length - 1) { 
            wx.hideLoading();
            return;
          }
          count++;
          
        }
      )
    }
  },
  
  //时间选择
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //运行时间输入
  runTimeInp: function (e) {
    this.setData({
      runTime: e.detail.value
    })
    console.log('runTime:', this.data.runTime)
  },
  //问题描述
  descriptionInp: function (e) {
    this.setData({
      description: e.detail.value
    })
    console.log('description:', this.data.description)
  },
  // 索赔内容
  claimInp: function (e) {
    this.setData({
      claim: e.detail.value
    })
    console.log('claim:', this.data.claim)
  },
  // 收货人
  receiverInp: function (e) {
    this.setData({
      receiver: e.detail.value
    })
    console.log('receiver:', this.data.receiver)
  },
  // 联系电话
  teleInp: function (e) {
    let tele = e.detail.value;
    this.setData({
      tele: e.detail.value
    })

  },
  // 联系地址
  receiveAddresInp: function (e) {
    this.setData({
      receiveAddres: e.detail.value
    })
    console.log('receiveAddres:', this.data.receiveAddres)
  },
  // 删除某张图片
  delImg: function (e) {
    let index = Number(e.target.dataset.index);
    console.log(index);
    console.log(this.data.showImgs);
    let showImgs = this.data.showImgs;

    showImgs.splice(index, 1);
    console.log(showImgs);
    // if(this.data.showImgs.length ==0){
    //   console.log("----------->>>>>>>>><<<<<<---------");
    //   this.setData({
    //     showImgs: []
    //   });
    //   showImgs = []
    //   app.data.Imgs = [];
    // }
    app.data.Imgs = showImgs;
    this.setData({
      showImgs: showImgs
    });
  },
  //删除视频
  delVideo(){
    this.setData({
      video:'',
      preVideo:''
    })
  },
  //点击保存
  saveMsg: function () {
    let count = 0;
    let length = 0;
    console.log("保存---------》");
    let photo = this.data.showImgs.join("|");
    // photo = photo+"|";
    console.log(photo)

    if (this.data.clientName) {
      wx.setStorageSync('clientName', this.data.clientName);
      count++;
    }
    if (this.data.typeIndex != null) {
      wx.setStorageSync('typeIndex', this.data.typeIndex);
      console.log("typesave");
      count++;
    }
    util.showModel('保存', `共保存了${count}条信息`)
  },
  submitMsg: function () {
    let count = 0;
    let length = 0;
    let AgentId;
    console.log("提交开始");
    console.log("verify", this.data.verify, "verifyInp", this.data.verifyInp);
    let photo = this.data.showImgs.join("|");
    console.log(photo);
    if(!this.data.problem){
      util.showModel('提示', '请输入故障描述');
      return;
    }
    if (this.data.depIndex === null || this.data.depIndex === undefined || this.data.depIndex === "") {
      util.showModel('提示', '请选择部门');
      return;
    }
    let type = '';
    if(this.data.types.length>0){
      if (this.data.typeIndex === null || this.data.typeIndex === undefined || this.data.typeIndex === "") {
        util.showModel('提示', '请选择机型');
        return;
      }
      type = this.data.types[this.data.typeIndex].Type
    }else{
      
    }
    
    // if (this.data.pressIndex === null || this.data.pressIndex === undefined || this.data.agentIndex === "") {
    //   util.showModel('提示', '请选择压力');
    //   return;
    // }
    if (this.data.bigIndex === null || this.data.bigIndex === undefined || this.data.bigIndex === "") {
      util.showModel('提示', '请选择故障大类');
      return;
    }
    if (this.data.litIndex === null || this.data.litIndex === undefined || this.data.litIndex === "") {
      util.showModel('提示', '请选择故障小类');
      return;
    }
    if (this.data.shoIndex === null || this.data.shoIndex === undefined || this.data.shoIndex === "") {
      util.showModel('提示', '请选择故障处理');
      return;
    }
    if (this.data.serialNum === null || this.data.serialNum === undefined || this.data.serialNum === "") {
      util.showModel('提示', '请输入序列号');
      return;
    }
    if (this.data.serialNum) {
      let reg = /^[A-Z]{3}/;
      let reg2 = /[\u4e00-\u9fa5]/g;
      if (!reg.test(this.data.serialNum)) {
        util.showModel('提示', '序列号前三位必须为大写字母');
        return;
      };
      if (reg2.test(this.data.serialNum)){
        util.showModel('提示', '序列号不能包含中文');
        return;
      }
    }
    
    // if (this.data.description === null || this.data.description === undefined || this.data.description === "") {
    //   util.showModel('提示', '请输入问题描述');
    //   return;
    // }
    if (photo === null || photo === undefined || photo === "") {
      util.showModel('提示', '请上传相关照片');
      return;
    }
    // if (this.data.video === null || this.data.video === undefined || this.data.video === "") {
    //   util.showModel('提示', '请上传相关视频');
    //   return;
    // }
    let Details = '';
    if (this.data.troublesShooting[0].FaultHandle){
      Details = this.data.troublesShooting[this.data.shoIndex].FaultHandle
    } else{
      Details = ''
    }
    var upData = {
      userId: wx.getStorageSync('userId'),
      DivSion: this.data.department[this.data.depIndex].Name,
      MachineType: type,//this.data.types[this.data.typeIndex].Type,// + "-" + this.data.press[this.data.pressIndex]
      MachineNum: this.data.serialNum,
      FailurePart:this.data.troublesBigPick[this.data.bigIndex].Rem,
      FailureShortDescription: this.data.troublesLitPick[this.data.litIndex].Rem,
      Details: Details , 
      Photn: photo + "|",
      Video: this.data.video,
      QAddress:this.data.location+"|"+this.data.city,
      FailureDescribe:this.data.problem
    };
    console.log("ZBDATAS>>", upData);
    console.log("canSubmit:",this.data.canSubmit)
    if(this.data.canSubmit){
      this.setData({
        canSubmit: false
      });
      $api.request(
        service.uploadFeedBackDatas,
        "POST",
        upData,
        (res) => {
          console.log("ZBsuccess!!", service.uploadFeedBackDatas, res);
          if (res.statusCode == 200) {
            util.showModel('提交结果', res.data.Results);
            if (res.data.Status) {
              this.setData({
                depIndex:null,
                typeIndex:null,
                pressIndex:null,
                bigIndex:null,
                litIndex:null,
                shoIndex:null,
                serialNum:'',
                showImgs:[],
                video:'',
                showVideo:''
              })
              wx.navigateTo({
                url: '../successTips/index',
              })
            }
          } else {
            if(res.data.Results){
              util.showModel('提交失败！请稍后重试', res.data.Results);
            }else{
              util.showModel('提交失败！', `错误代码:${res.statusCode},请稍后重试`);
            } 
            this.setData({
              canSubmit: true
            });
            return;
          }
        },
        (err) => {
          util.showModel('网络异常，提交失败', err);
          this.setData({
            canSubmit: true
          });
          return;
        },
        (res) => {
          console.log('complete-data-canSubmit',this.data.canSubmit)
        }
      );
      
    }else{
      util.showModel("无法提交", `亲，提交太频繁了，请${limit}秒内提交一次`)
    }
    setTimeout(()=>{
      this.setData({
        canSubmit: true
      })
    },limit*1000)
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
    console.log('LOCATION>>>',this.data.location)
    if (!this.data.location){
      util.GetSetting(
        () => {
          console.log("进入获取位置");
          util.GetLocation((res) => {
            console.log('GetLocationSuccess:', res);
            this.setLocation(res.latitude, res.longitude)
          }, (err) => {
            console.log('GetLocationFial:', err);
            //util.showModel('提示','网络异常，获取位置错误，请稍后再试');
            wx.switchTab({
              url: '../newindex/index',
            })
          })
        },
        () => {
          wx.switchTab({
            url: '../newindex/index',
          })
        }
      )
    }
    let brand = wx.getStorageSync('brand');
    let userType = wx.getStorageSync('userType');
    let agentId = wx.getStorageSync('agentId');
    let userShow = wx.getStorageSync('userShow');
    console.log("brand:", brand);
    console.log("onshowuserId:", wx.getStorageSync('userId'));
    console.log("userType:", userType);
    console.log("userShow:", wx.getStorageSync('userShow'));
    this.setData({
      brand: brand,
      userType: userType,
      agentId: agentId,
      userShow: userShow,
      chooses:[]
    });
    if (wx.getStorageSync('userId')) {
      this.setData({
        showPhoneInp: false
      });
    }
    if (this.data.department.length == 0 || this.data.troublesBigPick.length == 0 || this.data.troublesShooting.length == 0){
      this.getPickers();
    }
    //this.setLocation();
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");
    let random = (new Date).getTime();
    console.log(random)
    // this.setData({
    //   depIndex: null,
    //   typeIndex: null,
    //   pressIndex: null,
    //   bigIndex: null,
    //   litIndex: null,
    //   shoIndex: null,
    //   serialNum: '',
    //   showImgs: [],
    //   video: '',
    //   showVideo: ''
    // })
    // wx.switchTab({
    //   url: '../newindex/index',
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.setData({
    //   depIndex: null,
    //   typeIndex: null,
    //   pressIndex: null,
    //   bigIndex: null,
    //   litIndex: null,
    //   shoIndex: null,
    //   serialNum: '',
    //   showImgs: [],
    //   video: '',
    //   showVideo: ''
    // })
    // wx.switchTab({
    //   url: '../newindex/index',
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //this.init();
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
  },
  //   点击上传视频
  uploadAudio: function () {
    wx.pageScrollTo({
      scrollTop: 1200,
      duration: 300
    })
    var that = this;
    console.log('视频上传');
    let path;
    let usrId = wx.getStorageSync('userId');
    wx.chooseVideo({
      sourceType: ['album'],
      //maxDuration: 60,
      size:100,
      camera: 'back',
      success: (res) => {
        //util.showModel('提示', '视频选择成功')
        if (res.size >= 10485760) {
          //10485760;
          util.showModel('提示', '文件超过10M,不能上传');
          return;
        }
        console.log('>>>>>>>>>>>>>>',res);
        path = res.tempFilePath;
        this.setData({
          thumbTempFilePath: res.thumbTempFilePath
        });
        util.showLoading('视频信息采集中')
        wx.uploadFile({
          url: service.uploadUrl,
          filePath: path,
          name: 'file',
          formData: {},
          compressed:true,
          success: (res) => {
            console.log(res)
            let data = JSON.parse(res.data);
            if (data.Status) {
              that.setData({
                video: data.path,
                preVideo:path
              })
              app.data.video = data.path;
              wx.hideLoading();
              util.showModel('提示', '视频信息采集成功')
            } else {
              util.showModel('提示', '亲~视频信息采集失败了，再传一次吧')
            }
          },
          fail: (err) => {
            console.log(err);
            util.showModel('提示', '视频信息采集失败')
          },
          complete: (res) => {
            console.log(res);
            //util.showModel('上传结果', res)
            wx.hideLoading();
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //   点击上传图片
  uploadImage: function () {
    console.log('照片上传');
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {//返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          //img: res.tempFilePaths,
          imgChoosed: true
        });
        var i = 0; var length = res.tempFilePaths.length;

        var upload = function () {
          wx.uploadFile({
            url: service.uploadUrl,
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {},
            success: (res) => {
              console.log("success:", res);
              var datas = JSON.parse(res.data);
              console.log("IMAGE", datas.path)
              let showImgs = that.data.showImgs;
              showImgs.push(datas.path);
              that.setData({
                showImgs: showImgs
              })
            },
            fail: (err) => {
              console.log(err)
            },
            complete: (res) => {
              if (i == length - 1) { return };
              i++;
              upload();
            }
          });
        };
        upload();
        // util.uploadFiles('image',res.tempFilePaths,function(){
        //   console.log('AppImgs:', app.data.Imgs);
        //   that.setData({
        //     showImgs:app.data.Imgs
        //   })
        // })
      }
    })
  },
  //预览图片
  preImage(e){
    console.log(e.target.dataset.path);
    let path = e.target.dataset.path;
    wx.previewImage({
      current: path, // 当前显示图片的http链接
      urls: [path] // 需要预览的图片http链接列表
    })
  },
  //品牌选择器
  bindPickerBrand: function (e) {
    this.setData({
      brandIndex: Number(e.detail.value),
      brandNotChecked: false
    })
  },
  //代理商选择器
  bindPickerAgent: function (e) {
    this.setData({
      agentIndex: Number(e.detail.value),
      agentNotChecked: false
    });
    let agentIndex = this.data.agentIndex;
    let agentId = this.data.agent[agentIndex].Id;
    util.showLoading('数据获取ing...')
    $api.request(
      service.GetSaveReceiverMsg,
      "POST",
      {
        agentId: agentId
      },
      (res) => {
        console.log(res);
        if (res.data.Status) {
          let data = JSON.parse(res.data.Results)
          this.setData({
            receiver: data.receiver,
            tele: data.phone,
            receiveAddres: data.receiveAddres,
          })
        }else{
          if (res.data.Results){
            util.showModel('提示', res.data.Results)
          }else{
            util.showModel('提示',`获取收货人信息失败。错误代码:${res.statusCode},请稍后再试`)
          }
        }

      },
      (err) => {
        util.showModel(err.statusCode, '亲，网络错误，获取收货信息失败')
      },
      (res) => {
        wx.hideLoading();
      },
    )
  },
  //客户名称输入
  clientNameInp: function (e) {
    this.setData({
      clientName: e.detail.value
    });
    console.log("clientName:", this.data.clientName)
  },
  //故障描述输入
  problemInp(e){
    let problem = e.detail.value
    this.setData({
      problem,
    })
  },
  //压力选择器
  bindPickerPress: function (e) {
    this.setData({
      pressIndex: Number(e.detail.value),
      pressNotChecked: false
    })
  },
  //类型选择器
  bindPickerTypes: function (e) {
    if(this.data.depIndex == null){
      util.showModel('提示','请先选择部门');
      return;
    }
    this.setData({
      typeIndex: Number(e.detail.value),
      typesNotChecked: false
    })
  },
  //部门选择器
  bindPickerDepartment: function (e) {
    console.log(e);
    this.setData({
      depIndex: Number(e.detail.value),
      depNotChecked: false,
      typeIndex:null
    })
    console.log(this.data.depIndex);
    util.showLoading('获取机型ing....')
    $api.request(
      service.getTypes,
      "POST",
      {
        DepartmentId: this.data.department[this.data.depIndex].Id
      },
      (res)=>{
        console.log(service.getTypes,res);
        if(res.data.Status){
          let data  = JSON.parse(res.data.Results);
          this.setData({
            types:data
          })
        }else{
          if (res.data.Results){
            util.showModel('获取机型失败，请稍后再试', res.data.Results)
          }else{
            util.showModel('获取机型失败', `错误代码：${res.statusCode},请稍后再试`)
          }
        }
      },
      (err) => {
        console.log(err);
        util.showModel('提示','获取机型错误，请稍后再试')
      },
      (res) => {
        wx.hideLoading();
      }
    )
  },
  //打开选择器
  bindDepartment(e){
    this.setData({
      picker:'department',
      chooses: this.data.department,
      typeIndex:null
    })
  },
  bindTypes(){
    if(this.data.depIndex == null){
      util.showModel('提示','请先选择部门');
      return;
    }
    if (this.data.types.length == 0) {
      util.showModel('提示', '该部门下没有机型可供选择');
      return;
    }
    this.setData({
      picker: 'types',
      chooses: this.data.types,
    })
  },
  bindTroublesBigPick() {
    this.setData({
      picker: 'troublesBigPick',
      chooses: this.data.troublesBigPick,
      litIndex:null
    })
  },
  bindTroublesLitPick() {
    if (this.data.bigIndex === (null || undefined || "")) {
      util.showModel('提示', '请先选择故障大类');
      return;
    }
    this.setData({
      picker: 'troublesLitPick',
      chooses: this.data.troublesLitPick
    })
  },
  bindTroublesShooting() {
    this.setData({
      picker: 'troublesShooting',
      chooses: this.data.troublesShooting
    })
  },
  chooseItem(e){
    let picker = e.target.dataset.picker;
    let index = e.target.dataset.index;
    console.log(picker);
    switch(picker){
      case 'department':
        this.setData({
          depIndex:index,
          typeIndex:null
        })
        util.showLoading('获取机型ing....')
        $api.request(
          service.getTypes,
          "POST",
          {
            DepartmentId: this.data.department[this.data.depIndex].Id
          },
          (res) => {
            console.log(service.getTypes, res);
            if (res.data.Status) {
              let data = JSON.parse(res.data.Results);
              this.setData({
                types: data
              })
            } else {
              if (res.data.Results) {
                util.showModel('获取机型失败，请稍后再试', res.data.Results)
              } else {
                util.showModel('获取机型失败', `错误代码：${res.statusCode},请稍后再试`)
              }
            }
          },
          (err) => {
            console.log(err);
            util.showModel('提示', '获取机型错误，请稍后再试')
          },
          (res) => {
            wx.hideLoading();
          }
        )
        break;
      case 'types':
        this.setData({
          typeIndex:index
        });
        break;
      case 'troublesBigPick':
        this.setData({
          bigIndex:index,
          litIndex:null
        });
        let bigIndex = this.data.bigIndex;
        let bigTroublesId = this.data.troublesBigPick[bigIndex].Id;
        wx.showLoading('数据获取ing...')
        $api.request(
          service.getLitTroubles,
          'POST',
          {
            bigTroublesId: bigTroublesId
          },
          (res) => {
            console.log("troubleDes", res);
            let data = JSON.parse(res.data.Results)
            if (res.data.Status) {
              this.setData({
                troublesLitPick: data,
              })
            } else {
              if (res.data.Results) {
                util.showModel("提示", res.data.Results)
              } else {
                util.showModel("提示", `获取故障小类失败,错误代码:${res.statusCode},请稍后再试`)
              }
            }
          },
          (err) => {
            console.log(err);
            util.showModel(err.statusCode, '~亲，故障小类获取错误，请稍后再试');
          },
          (res) => {
            wx.hideLoading();
          }
        )
        break;
      case 'troublesLitPick':
        this.setData({
          litIndex:index
        });
        break;
      case 'troublesShooting':
        this.setData({
          shoIndex:index
        });
        break;
      default:
        break;
    }
    this.setData({
      chooses: []
    })
  },
  //故障大类选择器
  bindPickerBigTrouble: function (e) {
    var that = this;
    this.setData({
      bigIndex: e.detail.value,
      litIndex: null
    })
    //console.log(this.data.bigIndex);
    let bigIndex = this.data.bigIndex;
    let bigTroublesId = this.data.troublesBigPick[bigIndex].Id;
    wx.showLoading('数据获取ing...')
    $api.request(
      service.getLitTroubles,
      'POST',
      {
        bigTroublesId: bigTroublesId
      },
      (res) => {
        console.log("troubleDes", res);
        let data = JSON.parse(res.data.Results)
        if (res.data.Status) {
          that.setData({
            troublesLitPick: data
          })
        }else{
          if (res.data.Results){
            util.showModel("提示", res.data.Results)
          }else{
            util.showModel("提示", `获取故障小类失败,错误代码:${res.statusCode},请稍后再试`)
          }
        }
      },
      (err) => {
        console.log(err);
        util.showModel(err.statusCode, '~亲，故障小类获取错误，请稍后再试');
      },
      (res) => {
        wx.hideLoading();
      }
    )
  },
  //故障小类选择器
  bindPickerLitTrouble: function (e) {
    if (this.data.bigIndex == null) {
      util.showModel("提示", '请先选择故障大类')
      return;
    }
    this.setData({
      litIndex: e.detail.value
    })
    console.log(this.data.litIndex);
  },
  bindPickerTroubleShooting(e){
    console.log('bindPickerTroubleShooting', e.detail.value);
    if(this.data.litIndex == null){
      util.showModel("提示",'请先选择故障小类');
      return;
    }
    this.setData({
      shoIndex: e.detail.value
    })
  },
  //序列号输入
  serialNumInp: function (e) {
    let reg = /[\u4e00-\u9fa5]/g;
    let UpCase = e.detail.value.toUpperCase();
    console.log("中文验证", reg.test(UpCase));
    // if (reg.test(UpCase)){
    //   util.showModel("提示","亲~序列号不能包含中文");
    //   compare = false;
    //   return;
    // }
    this.setData({
      serialNum: UpCase
    })
    console.log(this.data.serialNum)
  }, 
  serialblur(){
    let reg = /^[A-Z]{3}/;
    let reg2 = /[\u4e00-\u9fa5]/g;
    let serialNum = this.data.serialNum;
    if (!reg.test(this.data.serialNum)) {
      this.setData({
        serialNum: ''
      })
      util.showModel('提示', '序列号前三位必须为大写字母');
      return;
    };
    if (reg2.test(this.data.serialNum)) {
      this.setData({
        serialNum: serialNum.replace(/[\u4e00-\u9fa5]/g,'')
      })
      util.showModel('提示', '序列号不能包含中文');
      return;
    }
  },
  //描述输入
  desInp: function (e) {
    this.setData({
      description: e.detail.value
    })
    console.log(this.data.description)
  },
})