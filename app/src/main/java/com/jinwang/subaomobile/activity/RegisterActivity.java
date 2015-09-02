package com.jinwang.subaomobile.activity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.jinwang.subaomobile.R;
import com.jinwang.subaomobile.SubaoApplication;
import com.jinwang.subaomobile.config.SystemConfig;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.apache.http.Header;
import org.json.JSONException;
import org.json.JSONObject;


public class RegisterActivity extends SubaoBaseActivity {

    public static final String REGIST_NAME="REGIST_NAME",REGIST_PWD="REGIST_PWD",CHECK_CODE="CHECK_CODE";
    private EditText edtTel,edtPwd;
    private Button btnSubmit;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        initToolBar();
        setTitle(getResources().getString(R.string.title_regist));
        setLeftBack();

        edtTel= (EditText) findViewById(R.id.edtTel);
        edtPwd= (EditText) findViewById(R.id.edtPwd);
        edtPwd.setVisibility(View.VISIBLE);
        btnSubmit= (Button) findViewById(R.id.submit);
        btnSubmit.setText(getResources().getString(R.string.title_regist));
    }


    public void doSubmit(View view){
        String tel=edtTel.getText().toString().trim();
        String pwd=edtPwd.getText().toString().trim();

        if(tel.length()==0){
            Toast.makeText(getApplication(), getString(R.string.empty_tel), Toast.LENGTH_SHORT).show();
            edtTel.requestFocus();
            return;
        }
        if(pwd.length()==0){
            Toast.makeText(getApplication(),getString(R.string.empty_pwd),Toast.LENGTH_SHORT).show();
            edtPwd.requestFocus();
            return;
        }
        //判断该号码是否已经注册--------接口4:注册
        judgeExistUser(tel,pwd);
    }

    public void judgeExistUser(final String tel, final String pwd){
        String url= SystemConfig.URL_REGIST_QRCODE_SEND;
        RequestParams params = new RequestParams();
        params.put(SystemConfig.KEY_Mobilephone, tel);

        AsyncHttpClient client = ((SubaoApplication) getApplication()).getSharedHttpClient();
        client.post(url, params, new JsonHttpResponseHandler(SystemConfig.SERVER_CHAR_SET) {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    Boolean success = response.getBoolean("success");
                    if (!success)
                        Toast.makeText(getApplication(), response.getString("errMsg"), Toast.LENGTH_SHORT).show();
                    else {
                        JSONObject object = response.getJSONArray("returnData").getJSONObject(0);
                        //进入下一个页面，下一个页面发送验证码验证，验证通过则注册成功
                        Intent intent = new Intent(getApplication(), RegValActivity.class);
                        intent.putExtra(REGIST_NAME, tel);
                        intent.putExtra(REGIST_PWD, pwd);
                        intent.putExtra(CHECK_CODE, object.getString("checkCode"));
                        startActivity(intent);
                        finish();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                Toast.makeText(getApplication(),getString(R.string.text_server_out),Toast.LENGTH_SHORT).show();
                Log.e("error", "RegisterActivity+judgeExistUser");
            }
        });
    }

}
