/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://qfb.1-zhao.com';
var config = {
    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        //获取openid
        getSaveUserOpenId: `${host}/UserInfo/GetSaveUserOpenId`,
        //获取验证码
        verifyUrl: `${host}/UserInfo/GetVerify`,
        // 非数据库用户登录
        loginUrl: `${host}/UserInfo/CommitUserInfo`,
        //获取用户反馈的信息分类
        GetFeedBackDatas: `${host}/FeedBackDatas/GetFeedBackDatas`,
        //获取积分记录
        GetIntegralRecord:`${host}/FeedBackDatas/GetIntegralRecord`,
        //获取单条反馈信息
        GetDetailDatas: `${host}/FeedBackDatas/GetDetailDatas`,
        //获取积分排名
        GetRanking: `${host}/Picker/GetIntegralRanking`,
        
        //提交
        uploadFeedBackDatas: `${host}/FeedBackDatas/CommitFeedBackData`,
        // 上传文件接口
        uploadUrl: `${host}/File/UploadFiles`,
        //PICKERS-
        getDepartment: `${host}/Picker/GetDepartment`,
        getTypes: `${host}/Picker/GetTypes`,
        getPress: `${host}/Picker/GetPress`,
        getBigTroubles: `${host}/Picker/GetBigTroubles`,
        getLitTroubles: `${host}/Picker/GetLitTroubles`,
        GetTroubleShooting: `${host}/Picker/GetListTroubleshooting`,



        // GetTotalIntergral: `${host}/weapp/GetTotalIntergral`,

        // GetHasAcceptDatas: `${host}/weapp/GetHasAcceptDatas`,
        // GetToBeConfirmedDatas: `${host}/weapp/GetToBeConfirmedDatas`,
        // GetNotAcceptDatas: `${host}/weapp/GetNotAcceptDatas`,
        // uploadImgsUrl: `${host}`,
        
        // /*-----------------login-------------------*/ 
        
        
        
        
        // /*----------------myfeed-------------------*/
        // feedBackData: `${host}/weapp/feedBackData`,
        // /*----------------myfeed-------------------*/
        // qualityUrl: `${host}/weapp/quality`,
       

       
    }
};

module.exports = config;
