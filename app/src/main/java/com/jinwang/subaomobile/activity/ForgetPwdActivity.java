package com.jinwang.subaomobile.activity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
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
import org.json.JSONException;
import org.json.JSONObject;


public class ForgetPwdActivity extends SubaoBaseActivity {

    private EditText edtTel;
    private Button btnSubmit;

    public static final String identify="identify";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        initToolBar();
        setTitle(getResources().getString(R.string.title_forget_pwd));
        setLeftBack();

        edtTel= (EditText) findViewById(R.id.edtTel);
        btnSubmit= (Button) findViewById(R.id.submit);
        btnSubmit.setText(getResources().getString(R.string.text_find_Pwd));
        btnSubmit.setTextSize(20);

        SharedPreferences sp=getSharedPreferences(PreferenceUtils.PREFERENCE, Context.MODE_PRIVATE);
        edtTel.setText(sp.getString(PreferenceUtils.PREFERENCE_USERNAME, ""));
    }

    public void doSubmit(View view){
        final String tel=edtTel.getText().toString().trim();
        if(tel.length()==0){
            Toast.makeText(getApplication(), getString(R.string.empty_tel), Toast.LENGTH_SHORT).show();
            edtTel.requestFocus();
            return;
        }
        /*判断是否存在该帐户————接口14*/
        String url= SystemConfig.URL_FORGET_PWD_1;
        RequestParams params=new RequestParams(SystemConfig.KEY_Mobilephone,tel);

        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.post(url,params,new JsonHttpResponseHandler(){
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    Boolean success = response.getBoolean("success");
                    if(!success)
                        Toast.makeText(getApplication(),response.getString("errMsg"),Toast.LENGTH_SHORT).show();
                    else{
                        JSONObject jsonObject=response.getJSONArray("returnData").getJSONObject(0);
                        Intent intent=new Intent(getApplicationContext(),EnterNewPwdActivity.class);
                        intent.putExtra(SystemConfig.KEY_Mobilephone,tel);
                        intent.putExtra(identify,jsonObject.getString(identify));
                        startActivity(intent);
                    }
                } catch (JSONException e) {
                    Log.e(getClass().getSimpleName(), "Response error: " + e.getMessage());
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                Toast.makeText(getApplication(),getString(R.string.text_server_out),Toast.LENGTH_SHORT).show();
                Log.e("error", "ForgetPwdActivity+doSubmit");
            }
        });

        /*//不存在该号码注册
        Toast.makeText(getApplication(), getString(R.string.error_none_Tel), Toast.LENGTH_SHORT).show();*/
        //startActivity(new Intent(getApplicationContext(), EnterNewPwdActivity.class));

    }

}
