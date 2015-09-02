package com.jinwang.subaomobile.activity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
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


public class EnterNewPwdActivity extends SubaoBaseActivity {

    private EditText edtVal,edtNewPwd,edtConfirmPwd;
    private TextView tvTel;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_enter_new_pwd);

        initToolBar();
        setTitle(getResources().getString(R.string.title_enter_new_pwd));
        setLeftBack();

        edtVal= (EditText) findViewById(R.id.edtVal);
        edtNewPwd= (EditText) findViewById(R.id.edtNewPwd);
        edtConfirmPwd= (EditText) findViewById(R.id.edtConfirmPwd);
        tvTel= (TextView) findViewById(R.id.tvTel);

        tvTel.setText(getIntent().getStringExtra(SystemConfig.KEY_Mobilephone));
    }

    public void doConfirm(View view){
        String val=edtVal.getText().toString().trim();
        String newPwd=edtNewPwd.getText().toString().trim();
        String confirmPwd=edtConfirmPwd.getText().toString().trim();

        if(val.length()==0){
            Toast.makeText(getApplication(), getString(R.string.empty_val), Toast.LENGTH_SHORT).show();
            edtVal.requestFocus();
            return;
        }
        /*判断验证码是否正确*/
        if(!val.equals(getIntent().getStringExtra(ForgetPwdActivity.identify))){
            Toast.makeText(getApplication(), getString(R.string.text_wrong_val), Toast.LENGTH_SHORT).show();
            edtVal.requestFocus();
            return;
        }
        if(newPwd.length()==0){
            Toast.makeText(getApplication(), getString(R.string.empty_new_pwd), Toast.LENGTH_SHORT).show();
            edtNewPwd.requestFocus();
            return;
        }
        if(confirmPwd.length()==0){
            Toast.makeText(getApplication(), getString(R.string.empty_confirm_pwd_2), Toast.LENGTH_SHORT).show();
            edtConfirmPwd.requestFocus();
            return;
        }
        if(!newPwd.equals(confirmPwd)){
            Toast.makeText(getApplication(), getString(R.string.differ_pwd_2), Toast.LENGTH_SHORT).show();
            return;
        }
        //----------------接口十五:忘记密码第2步操作
        doSubmit(newPwd,val);
    }

    public void doSubmit(String pwd,String identify){
        String url=SystemConfig.URL_FORGET_PWD_2;
        RequestParams params=new RequestParams();
        params.put(SystemConfig.KEY_Mobilephone,getIntent().getStringExtra(SystemConfig.KEY_Mobilephone));
        params.put(SystemConfig.KEY_Identify,identify);
        params.put(SystemConfig.KEY_Newpassword,pwd);

        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.post(url,params,new JsonHttpResponseHandler(SystemConfig.SERVER_CHAR_SET){
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    Boolean success = response.getBoolean("success");
                    if(!success)
                        Toast.makeText(getApplication(),response.getString("errMsg"),Toast.LENGTH_SHORT).show();
                    else
                        startActivity(new Intent(getApplicationContext(),LoginActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
                } catch (JSONException e) {
                    Log.e(getClass().getSimpleName(), "Response error: " + e.getMessage());
                }
            }
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                Toast.makeText(getApplication(),getString(R.string.text_server_out),Toast.LENGTH_SHORT).show();
                Log.e("error", "EnterNewPwdActivity+doSubmit");
            }
        });
    }

}
