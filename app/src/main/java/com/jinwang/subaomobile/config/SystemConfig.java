package com.jinwang.subaomobile.config;

import android.os.Environment;

/**
 * Created by Chenss on 2015/8/24.
 */
public class SystemConfig {

    //ENCODING------GBK
    public static final String SERVER_CHAR_SET="GBK";

    //SYSTEM ROLE
    public static final String SYSTEM_ROLE="SYSTEM_ROLE";
    public static final String SYSTEM_ROLE_DEFAULT="Group0004";

    //URL CONFIG
    public static final String SERVER_IP="121.40.250.221";
    public static final String SERVER_PORT="8080";

    public static final String URL_BASE = "http://" + SERVER_IP + ":" + SERVER_PORT;


    public static final String URL_LOGIN = URL_BASE + "/ybpt/web/ybmobile/MobileLogin_Login.action";
    public static final String URL_REGIST_QRCODE_SEND = URL_BASE + "/ybpt/web/ybmobile/CheckMobileCode_produceCode.action";
    public static final String URL_REGIST_QRCODE_VERFY = URL_BASE + "/ybpt/web/ybmobile/CheckMobileCode_checkCode.action";
    public static final String URL_REGIST = URL_BASE + "/ybpt/web/ybmobile/MobileReg_Register.action";
    public static final String URL_FORGET_PWD_1 = URL_BASE + "/ybpt/web/ybmobile/ForgetPwd_doPwdFirst.action";
    public static final String URL_FORGET_PWD_2 = URL_BASE + "/ybpt/web/ybmobile/ForgetPwd_doPwdSecond.action";
    public static final String URL_MODIFY_PWD = URL_BASE + "/ybpt/web/ybmobile/ChangePwd_updatePwd.action";
    public static final String URL_LOAD_HEAD = URL_BASE + "/ybpt/web/ybmobile/DownLoadPic_downLoadPic.action";
    public static final String URL_UPLOAD_HEAD = URL_BASE + "/ybpt/web/ybplatform/mobileUpload.jsp";

        //===URL PARAMTERS
    public static final String KEY_Mobilephone = "Mobilephone";
    public static final String KEY_Password = "Password";
    public static final String KEY_OperationType = "OperationType";
    public static final String KEY_Checkcode = "Checkcode";
    public static final String KEY_Role = "Role";
    public static final String KEY_Useridnumber = "Useridnumber";
    public static final String KEY_Worknumber = "Worknumber";
    public static final String KEY_jsonString = "jsonString";
    public static final String KEY_Newpassword = "Newpassword";
    public static final String KEY_Muuid = "Muuid";
    public static final String KEY_Identify = "Identify";
    public static final String KEY_fileName = "fileName";
    public static final String KEY_id = "id";
    public static final String KEY_mainId = "mainId";
    public static final String KEY_moduleId = "moduleId";
    public static final String KEY_pic = "pic";

    //public static final String KEY_ = "";

        //===URL PARAMTERS
    public static final String VALUE_OperationType = "A";
    public static final String VALUE_id = "imageUpload";
    public static final String VALUE_moduleId = "moduleIdIdenty";
    //public static final String VALUE_ = "";

    //本地头像保存的路径
    public static final String PATH_HEAD= Environment.getExternalStorageDirectory()+"/SubaoHead/";
    public static final String HEAD_TYPE= ".png";
    //public static final String HEAD_NAME= "head.png";





}
