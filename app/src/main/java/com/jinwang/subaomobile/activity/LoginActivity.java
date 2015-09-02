package com.jinwang.subaomobile.activity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.jinwang.subaomobile.R;
import com.jinwang.subaomobile.SubaoApplication;
import com.jinwang.subaomobile.config.SystemConfig;
import com.jinwang.subaomobile.utils.PreferenceUtils;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.Policy;

public class LoginActivity extends SubaoBaseActivity {

    private EditText edtTel,edtPwd;
    private TextView forget_Pwd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        initToolBar();
        setTitle(getResources().getString(R.string.title_login));
        setRightRegist();

        edtTel= (EditText) findViewById(R.id.edtTel);
        edtPwd= (EditText) findViewById(R.id.edtPwd);
        edtPwd.setVisibility(View.VISIBLE);
        forget_Pwd= (TextView) findViewById(R.id.forget_Pwd);
        forget_Pwd.setVisibility(View.VISIBLE);

        SharedPreferences sp=getSharedPreferences(PreferenceUtils.PREFERENCE, Context.MODE_PRIVATE);
        edtTel.setText(sp.getString(PreferenceUtils.PREFERENCE_USERNAME, ""));
        edtPwd.setText(sp.getString(PreferenceUtils.PREFERENCE_PASSWORD, ""));
    }

    public void doSubmit(View view){
        String tel=edtTel.getText().toString().trim();
        String pwd=edtPwd.getText().toString().trim();

        if(tel.length()==0){
            Toast.makeText(getApplication(),getString(R.string.empty_tel),Toast.LENGTH_SHORT).show();
            edtTel.requestFocus();
            return;
        }
        if(pwd.length()==0){
            Toast.makeText(getApplication(),getString(R.string.empty_pwd),Toast.LENGTH_SHORT).show();
            edtPwd.requestFocus();
            return;
        }
        //=================接口一：登录验证
        loginVerify(tel, pwd);


    }

    public void loginVerify(final String tel, final String pwd){
        String url=SystemConfig.URL_LOGIN;
        RequestParams params=new RequestParams();
        params.put(SystemConfig.KEY_Mobilephone,tel);
        params.put(SystemConfig.KEY_Password,pwd);
        params.put(SystemConfig.KEY_OperationType,SystemConfig.VALUE_OperationType);
        //Log.i("test","url："+url+"params："+params.toString());
        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.post(url,params,new JsonHttpResponseHandler(SystemConfig.SERVER_CHAR_SET){
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    Boolean success=response.getBoolean("success");
                    if(!success)
                        Toast.makeText(getApplication(),response.getString("errMsg"),Toast.LENGTH_SHORT).show();
                    else{
                        JSONObject object=response.getJSONArray("returnData").getJSONObject(0);
                        String muuid=object.getString("mUuid");
                        String role=object.getString("role");
                        String userName=object.getString("userName");

                        //验证正确存储到SharedPreference 再跳转至主页
                        PreferenceUtils.saveLoginInfo(getApplicationContext(), tel, pwd);

                        Intent intent=new Intent(getApplicationContext(),MainActivity.class);
                        intent.putExtra(SystemConfig.KEY_Muuid,muuid);
                        intent.putExtra(SystemConfig.SYSTEM_ROLE,role);
                        intent.putExtra(SystemConfig.KEY_Mobilephone,userName);
                        startActivity(intent);
                        finish();
                    }

                } catch (JSONException e) {
                    Log.e(getClass().getSimpleName(), "Response error: " + e.getMessage());
                }

            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                //super.onFailure(statusCode, headers, throwable, errorResponse);
                Toast.makeText(getApplication(),getString(R.string.text_server_out),Toast.LENGTH_SHORT).show();
                Log.e("error", "LoginActivity+loginVerify");
            }
        });
    }

    /*忘记密码，跳转至对应页面尝试找回密码*/
    public void forgetPwd(View view){
        startActivity(new Intent(getApplicationContext(),ForgetPwdActivity.class));
    }



}