package com.jinwang.subaomobile.activity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
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


public class RegValActivity extends SubaoBaseActivity {

    private EditText edtVal;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reg_val);

        initToolBar();
        setTitle(getResources().getString(R.string.title_reg_val));
        setLeftBack();

        edtVal= (EditText) findViewById(R.id.edtVal);
        Toast.makeText(getApplication(), getIntent().getStringExtra(RegisterActivity.CHECK_CODE), Toast.LENGTH_SHORT).show();
    }

    public void doSubmit(View view){
        String val=edtVal.getText().toString().trim();
        if(val.length()==0){
            Toast.makeText(getApplication(), getString(R.string.empty_val), Toast.LENGTH_SHORT).show();
            edtVal.requestFocus();
            return;
        }
        //接口三：验证码验证:
        String url= SystemConfig.URL_REGIST_QRCODE_VERFY;
        RequestParams params=new RequestParams();
        params.put(SystemConfig.KEY_Mobilephone, getIntent().getStringExtra(RegisterActivity.REGIST_NAME));
        params.put(SystemConfig.KEY_Checkcode,val);

        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.post(url, params, new JsonHttpResponseHandler(SystemConfig.SERVER_CHAR_SET) {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    Boolean success = response.getBoolean("success");
                    if (!success)
                        Toast.makeText(getApplication(), response.getString("errMsg"), Toast.LENGTH_SHORT).show();
                    else
                        doRegist();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                Toast.makeText(getApplication(), getString(R.string.text_server_out), Toast.LENGTH_SHORT).show();
                Log.e("error", "RegValActivity+doSubmit");
            }
        });
    }
    //接口四：注册
    public void doRegist(){
        String url= SystemConfig.URL_REGIST;
        RequestParams params=new RequestParams();
        params.put(SystemConfig.KEY_Mobilephone,getIntent().getStringExtra(RegisterActivity.REGIST_NAME));
        params.put(SystemConfig.KEY_Password, getIntent().getStringExtra(RegisterActivity.REGIST_PWD));
        params.put(SystemConfig.KEY_Role, "Group0004");

        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.post(url, params, new JsonHttpResponseHandler(SystemConfig.SERVER_CHAR_SET) {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    Boolean success = response.getBoolean("success");
                    if (!success)
                        Toast.makeText(getApplication(), response.getString("errMsg"), Toast.LENGTH_SHORT).show();
                    else {
                        Toast.makeText(getApplication(), getString(R.string.error_val), Toast.LENGTH_SHORT).show();
                        startActivity(new Intent(getApplication(), LoginActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                Toast.makeText(getApplication(), getString(R.string.text_server_out), Toast.LENGTH_SHORT).show();
                Log.e("error","RegValActivity+doRegist");
            }
        });
    }
}
