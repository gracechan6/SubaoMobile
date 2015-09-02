package com.jinwang.subaomobile.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by Chenss on 2015/8/18.
 */
public class PreferenceUtils {
    public static final String PREFERENCE = "PREFERENCE";

    //保存用户账号
    public static final String PREFERENCE_USERNAME = "PREFERENCE_USERNAME";
    //保存密码
    public static final String PREFERENCE_PASSWORD = "PREFERENCE_PASSWORD";

    public static void saveLoginInfo(Context context,String userName,String pwd){
        SharedPreferences sp=context.getSharedPreferences(PREFERENCE,Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sp.edit();
        editor.putString(PREFERENCE_USERNAME,userName);
        editor.putString(PREFERENCE_PASSWORD,pwd);
        editor.commit();
    }

    public static String getUserName(Context context){
        SharedPreferences sp=context.getSharedPreferences(PREFERENCE,Context.MODE_PRIVATE);
        return sp.getString(PREFERENCE_USERNAME,"");
    }

}
