let config = require('../config.js');
let service = config.service;
let DEBUG = false;//切换数据入口
var Mock = require('mock.js')
function request(url, method, data, success, fail, complete) {
  fail = typeof (fail) === 'function' ? fail : function (){};
  complete = typeof (complete) === 'function' ? complete : function (){};
  wx.request({
    url: url,
    method: method,
    data: data,
    header: { 'content-type': 'application/json' },
    success: success,
    fail: fail,
    complete: complete
  })
}
function $http(url,method,data){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: url,
      method: method,
      data: data,
      header: { 'content-type': 'application/json' },
      success: (res)=>{
        resolve(res);
      },
      fail: (err)=>{
        reject(err);
      }
    })
  })
}
// function request(url,method, data, success, fail, complete) {
//   complete = typeof (complete) === 'function' ? complete : function () { };
//   if (!DEBUG) {
//     fail = typeof (fail) === 'function' ? fail : function () { };
//     complete = typeof (complete) === 'function' ? complete : function () { };
//     wx.request({
//       url: url,
//       method: method,
//       data: data,
//       header: { 'content-type': 'application/json' },
//       success: success,
//       fail: fail,
//       complete: complete
//     })
//     success(res)
//   }
//   else if (url == service.uploadFeedBackDatas) {
//     // 模拟数据
//     var res = Mock.mock({
//       'res': true,
//       'data': data,
//       'msg': "你提交的信息"
//     })
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     success(res);
//   }
//   else if(url == service.verifyUrl){
//     // 模拟数据
//     var res = Mock.mock({
//       'status': 200,
//       'data':data,
//       'verify':468486,
//       'msg': "验证码已经发送"
//     })
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     success(res);
//   }
//   else if (url == service.GetTotalIntergral){
//     res = {
//       integral:150,
//       res:true
//     };
//     success(res)
//   }
//   else if (url == service.GetHasAcceptDatas){
//     var res = {
//       res: true,
//       data: [
//       ]
//     };
//     if(data.pageIndex ==0){
//       res.data = [
//         {
//           id:'33333333333333',
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//         {
//           id:'44444444444444444',
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//         {
//           id:'5555555555555555555555',
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//         {
//           id:'66666666666666666666',
//           applyTime: 1525421198,
//           department: "产品部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 50
//         },
//       ]
//     }
    
//     else if (data.pageIndex == 1){
//       res.data = [
//         {
//           id:'77777777777777777',
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 100
//         },
//         {
//           id:'8888888888888888888',
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 100
//         }
//       ]
//     }
//     else if (data.pageIndex == 2) {
//       res.data = [
//         {
//           id:'999999999999999999999',
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 200
//         },
//         {
//           id:'10101010',
//           applyTime: 1525421198,
//           department: "产品部1",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类3",
//           litTrouble: "故障小类3",
//           img: ['/images/upload_img2.png'],
//           video: "",
//           addIntegral: 200
//         }
//       ]
//     }
//     success(res)
//   }
//   else if (url == service.GetNotAcceptDatas) {
//     res = {
//       res:true,
//       data:[
//         {
//           id:'1111111111111111111',
//           applyTime: 1525421198,
//           department: "技术部-未采用",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         },
//         {
//           id:'222222222222222222',
//           applyTime: 1525421198,
//           department: "技术部-未采用",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         },
//         {
//           id: '121212121221212',
//           applyTime: 1525421198,
//           department: "技术部-未采用",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         }
//       ]
//     };
//     success(res);
//   }
//   else if (url == service.GetToBeConfirmedDatas) {
//     res = {
//       res: true,
//       data: [
//         {
//           applyTime: 1470220608533,
//           department: "技术部-待确定",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         }
//       ]
//     };
//     success(res);
//   }
//   else if (url == service.qualityUrl) {
//     // 模拟数据
//     var res = {
//       department: ['技术', '管理', '人事', '行政'],//部门
//       press: [1200, 2400, 3600],//压力
//       types: ['第一种', '第二种', '第三种'],//机型
//       serialNum: null,
//       description: '',
//       troubles: [
//         // range-key 的值就是你要显示的内容的属性名，例如这里的name
//         // 二维数组的第一个相当于第一列的选择
//         [
//           {
//             id: 0,
//             name: '第一种'
//           },
//           {
//             id: 1,
//             name: '第二种'
//           },
//           {
//             id: 2,
//             name: '第三种'
//           }
//         ],
//         //二维数组的第二个相当于第二列的选择
//         [
//           [{
//             id: 0,
//             name: '11'
//           },
//           {
//             id: 1,
//             name: '22'
//           },
//           {
//             id: 2,
//             name: '33'
//           }],
//           [{
//             id: 0,
//             name: '1111',
//           },
//           {
//             id: 1,
//             name: '2222',
//           },
//           {
//             id: 2,
//             name: '3333',
//           }],
//           [{
//             id: 0,
//             name: '7777',
//           },
//           {
//             id: 1,
//             name: '8888',
//           },
//           {
//             id: 2,
//             name: '9999',
//           }]
//         ]
//       ]
//     }
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     success(res);
//     complete({msg:"完成"})
//   }
//   else if(url == service.loginUrl){
//     // 模拟数据
//     var res = Mock.mock({
//       'status': 200,
//       'res':true,
//       'userId':'868465116487',
//       'msg': "登录成功"
//     })
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
    
//     setTimeout(function(){
//       success(res);
//     })
//   }
//   else if (url == service.getSaveUserOpenId) {
//     // 模拟数据
//     var res = {
//       data:{
//         openid:data.code,
//         res:true,
//         userId:'16498798131544'
//       }
//     }
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     //setTimeout(function () {
//       success(res);
//       complete();
//     //})
//   }
//   else if(url == service.feedBackDataUrl){
//     var res = {
//       integral:100,
//       feedBackData:[
//       [
//         {
//           applyTime: "2018/3/17 16:14:25",
//           department: "工程部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段1",
//           desDetail: "电机噪音大。。。。。。。。。。。。。。。。",
//           bigTrouble: "故障大类1",
//           litTrouble: "故障小类1",
//           img: ['/images/upload_img1.png', '/images/upload_img2.png'],
//           video: "/images/audio2.mp4"
//         },
//         {
//           applyTime: "2018/3/17 16:14:25",
//           department: "技术部",
//           types: "LCH15-10",
//           serialNum: "COX004874",
//           des: "主机转子严重磨损，机器在卸载时间段2",
//           desDetail: "电机噪音大主机转子严重磨损，机器在卸载时间段2主机转子严重磨损，机器在卸载时间段主机转子严重磨损，机器在卸载时间段2",
//           bigTrouble: "故障大类2",
//           litTrouble: "故障小类2",
//           img: ['/images/upload_img1.png', '/images/upload_img1.png'],
//           video: ""
//         }
//       ],
      
//     ]
//   }
//     // 输出结果
//     //console.log(JSON.stringify(res, null, 2))
//     setTimeout(function () {
//       success(res);
//     },2000)
//     complete({
//       status:200,
//       msg:'请求完成'
//     })
//   }
//   else{
//     // 模拟数据
//     var res = Mock.mock({
      
//     })
//     // 输出结果
//     // console.log(JSON.stringify(res, null, 2))
//     fail({
//       'status': 300,
//       'msg': "接口错误"
//     });
//   }
// }
module.exports = {
  request,
  $http
}