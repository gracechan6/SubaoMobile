package com.jinwang.subaomobile.activity;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.jinwang.subaomobile.R;
import com.jinwang.subaomobile.SubaoApplication;
import com.jinwang.subaomobile.config.SystemConfig;
import com.jinwang.subaomobile.utils.PreferenceUtils;
import com.jinwang.subaomobile.widget.ActionSheet;
import com.jinwang.subaomobile.widget.CircleImageView;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.FileAsyncHttpResponseHandler;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.apache.http.Header;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 *
 */
public class SettingActivity extends SubaoBaseActivity  implements ActionSheet.MenuItemClickListener {

    private EditText edtOldPwd,edtNewPwd,edtConfirmPwd;
    private Button btnConfirm;
    Dialog dialog;

    //private static String path="/sdcard/myHead/";//sd路径
    private CircleImageView ivHead;//头像显示
    public static int CROP_REQUEST_CODE = 10001;
    public static int Setting = 10002;
    public static final String PHOTO_TYPE = "PHOTO_TYPE";
    private String headPath;

    @Override
    protected void onResume() {
        super.onResume();
        if(EditInfoActivity.HeadChanged)
            setHead();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);

        initToolBar();
        setLeftBack();
        setTitle(getResources().getString(R.string.title_setting));

        ivHead= (CircleImageView) findViewById(R.id.civ_head);
        headPath=SystemConfig.PATH_HEAD+ PreferenceUtils.getUserName(getApplication())+SystemConfig.HEAD_TYPE;
        setHead();
    }

    /**
     * 头像显示
     */
    public  void setHead(){
        File file=new File(headPath);
        if(file.exists()){
            Bitmap bm= BitmapFactory.decodeFile(headPath);
            ivHead.setImageBitmap(bm);
        }
        else
            /*去服务器端获取图片下载路径*/
            getHeadUrl();

    }
    /*去服务器端获取图片下载路径*/
   public void  getHeadUrl(){
       String url=SystemConfig.URL_LOAD_HEAD;
       RequestParams params=new RequestParams(SystemConfig.KEY_Muuid,getIntent().getStringExtra(SystemConfig.KEY_Muuid));
       AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
       client.post(url, params, new JsonHttpResponseHandler() {
           @Override
           public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
               try {
                   Boolean success = response.getBoolean("success");
                   if (!success)
                       Toast.makeText(getApplication(), response.getString("errMsg"), Toast.LENGTH_SHORT).show();
                   else
                       downLoadHead(response.getString("pathLoad"));
               } catch (JSONException e) {
                   Log.e(getClass().getSimpleName(), "Response error: " + e.getMessage());
               }
           }

           @Override
           public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
               Toast.makeText(getApplication(), getString(R.string.text_server_out), Toast.LENGTH_SHORT).show();
               Log.e("error","SettingActivity+getHeadUrl");
           }
       });
   }

    /*去服务器端下载图片并保存到本地*/
    public void  downLoadHead(String url){
        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.get(url, new FileAsyncHttpResponseHandler(new File(headPath)) {
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, File file) {
                Toast.makeText(getApplication(), getString(R.string.text_fail_download), Toast.LENGTH_SHORT).show();
                Log.e("error", "downLoadHead");
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, File file) {
                Log.i(getClass().getSimpleName(), getString(R.string.text_success_download));
                Bitmap bm = BitmapFactory.decodeFile(headPath);
                ivHead.setImageBitmap(bm);
            }
        });
    }

    /*编辑个人资料*/
    public void editInfo(View view){
        Intent intent=new Intent(getApplication(),EditInfoActivity.class);
        startActivityForResult(intent, Setting);
    }

    /*关于甬宝*/
    public void doAbout(View view){
        Toast.makeText(getApplicationContext(),"正在研发中",Toast.LENGTH_SHORT).show();
    }

    /*用户协议*/
    public void doProtocol(View view){
        Toast.makeText(getApplicationContext(),"正在研发中",Toast.LENGTH_SHORT).show();
    }

    /*意见反馈*/
    public void doOpinion(View view){
        Toast.makeText(getApplicationContext(),"正在研发中",Toast.LENGTH_SHORT).show();
    }

    /*修改密码===============显示修改密码dialog*/
    public void doModifyPwd(View view){
        LayoutInflater inflater=LayoutInflater.from(this);
        View modifyView=inflater.inflate(R.layout.layout_modify_pwd, null);
        dialog=new AlertDialog.Builder(this).
                        setView(modifyView).
                        create();
        dialog.show();

        edtOldPwd= (EditText) modifyView.findViewById(R.id.edtOldPwd);
        edtNewPwd= (EditText) modifyView.findViewById(R.id.edtNewPwd);
        edtConfirmPwd= (EditText) modifyView.findViewById(R.id.edtConfirmPwd);

        btnConfirm= (Button) modifyView.findViewById(R.id.btnConfirm);
        btnConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ModifyPwd();
            }
        });

    }

    /*修改密码===============dialog填写完原密码新密码等信息 验证*/
    public void ModifyPwd(){
        String oldPwd=edtOldPwd.getText().toString().trim();
        String newPwd=edtNewPwd.getText().toString().trim();
        String confirmPwd=edtConfirmPwd.getText().toString().trim();

        if(oldPwd.length()==0){
            Toast.makeText(getApplication(),getString(R.string.empty_old_pwd),Toast.LENGTH_SHORT).show();
            edtOldPwd.requestFocus();
            return;
        }
        else{
            /*判断密码是否为正确的登录密码----接口*/
        }
        if(newPwd.length()==0){
            Toast.makeText(getApplication(),getString(R.string.empty_new_pwd),Toast.LENGTH_SHORT).show();
            edtNewPwd.requestFocus();
            return;
        }
        if(confirmPwd.length()==0){
            Toast.makeText(getApplication(),getString(R.string.empty_confirm_pwd),Toast.LENGTH_SHORT).show();
            edtConfirmPwd.requestFocus();
            return;
        }
        if (!newPwd.equals(confirmPwd)){
            Toast.makeText(getApplication(),getString(R.string.differ_pwd),Toast.LENGTH_SHORT).show();
            return;
        }

        //修改密码，接口---
        submitNewPwd(newPwd);
        //关闭alertDialog
        dialog.dismiss();
        //dialog.cancel();//也会调用dialog.dismiss();
    }

    /*修改密码===============接口六：密码修改  提交接口*/
    public void submitNewPwd(String pwd){
        String url= SystemConfig.URL_MODIFY_PWD;
        RequestParams params=new RequestParams();
        params.put(SystemConfig.KEY_Muuid, getIntent().getStringExtra(SystemConfig.KEY_Muuid));
        params.put(SystemConfig.KEY_Newpassword, pwd);

        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.post(url, params, new JsonHttpResponseHandler(SystemConfig.SERVER_CHAR_SET) {
            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                Toast.makeText(getApplication(), getString(R.string.text_server_out), Toast.LENGTH_SHORT).show();
                Log.e("error", "SettingActivity+submitNewPwd");
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    Boolean success = response.getBoolean("success");
                    if (!success)
                        Toast.makeText(getApplication(), response.getString("errMsg"), Toast.LENGTH_SHORT).show();
                    else
                        Toast.makeText(getApplication(), getString(R.string.modify_pwd_success), Toast.LENGTH_SHORT).show();
                } catch (JSONException e) {
                    Log.e(getClass().getSimpleName(), "Response error: " + e.getMessage());
                }
            }
        });
    }

    /*更改头像  actionSheet显示*/
    public void showActionSheet(View view){
        setTheme(R.style.ActionSheetStyleIOS7);
        ActionSheet menuView = new ActionSheet(this);
        menuView.setCancelButtonTitle(getResources().getString(R.string.text_cancel));// before add items
        menuView.addItems(getResources().getString(R.string.text_take_photo),
                getResources().getString(R.string.text_from_gallery));
        menuView.setItemClickListener(this);
        menuView.setCancelableOnTouchMenuOutside(true);
        menuView.showMenu();
    }

    /*actionSheet  三个选项选择其一操作*/
    @Override
    public void onItemClick(int itemPosition) {
        switch (itemPosition){
            case 0://调用相机拍照
            case 1://从相册里面取照片
                changePhoto(itemPosition);
                break;
            default:break;
        }
    }

    /**
     * 修改头像
     * @param index 0 - 拍照， 1 - 相册
     */
    public void changePhoto(int index) {
        Intent intent = new Intent(this, CropActivity.class);
        intent.putExtra(PHOTO_TYPE, index);
        startActivityForResult(intent, CROP_REQUEST_CODE);
    }

    /**
     * 启动拍照  选择相册图片  裁剪图片等外部操作后返回该如何操作
     * @param requestCode
     * @param resultCode
     * @param data
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //super.onActivityResult(requestCode, resultCode, data);
        if (requestCode==CROP_REQUEST_CODE && resultCode== Activity.RESULT_OK){
            /*
            * 头像保存至服务器
            * */
            Bitmap bitmap=data.getExtras().getParcelable(CropActivity.BITMAP_DATA);
            uploadHeadToServer();
        }
    }

    /**
     * 把更新的头像上传到服务器
     */
    public void uploadHeadToServer(){
        File file=new File(headPath);
        String url=SystemConfig.URL_UPLOAD_HEAD;
        RequestParams params=new RequestParams();
        String userName=PreferenceUtils.getUserName(getApplication());
        params.put(SystemConfig.KEY_fileName,userName+SystemConfig.HEAD_TYPE);
        params.put(SystemConfig.KEY_id,SystemConfig.VALUE_id);
        params.put(SystemConfig.KEY_mainId,userName);
        params.put(SystemConfig.KEY_moduleId,SystemConfig.VALUE_moduleId);
        try {
            params.put(SystemConfig.KEY_pic,file);
        } catch (FileNotFoundException e) {
            Log.e(getClass().getSimpleName(),e.getMessage().toString());
        }
        /**
         * 异步上传单个文件
         */
        AsyncHttpClient client=((SubaoApplication)getApplication()).getSharedHttpClient();
        client.post(url, params, new AsyncHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, byte[] responseBody) {
                setHead();
                Toast.makeText(getApplication(),getString(R.string.text_success_headLoad),Toast.LENGTH_SHORT).show();

            }

            @Override
            public void onFailure(int statusCode, Header[] headers, byte[] responseBody, Throwable error) {
                Toast.makeText(getApplication(),getString(R.string.text_server_out),Toast.LENGTH_SHORT).show();
                Log.e("error", "SettingActivity+uploadHeadToServer");
            }
        });
    }
}
