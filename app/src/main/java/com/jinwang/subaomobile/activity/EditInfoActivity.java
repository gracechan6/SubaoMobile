package com.jinwang.subaomobile.activity;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
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

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Hashtable;

public class EditInfoActivity extends SubaoBaseActivity implements ActionSheet.MenuItemClickListener {

    ImageView imv_qrcode;

    private Bitmap head;//头像Bitmap
    private CircleImageView ivHead;//头像显示
    private String headPath;
    public static Boolean HeadChanged=false;

    private TextView tvNickName,tvYongBaoId,tvTel;

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_info);

        initToolBar();
        setLeftBack();
        setTitle(getResources().getString(R.string.title_edit_info));
        ivHead= (CircleImageView) findViewById(R.id.civ_head);
        headPath=SystemConfig.PATH_HEAD+ PreferenceUtils.getUserName(getApplication())+SystemConfig.HEAD_TYPE;
        setHead();

        imv_qrcode= (ImageView) findViewById(R.id.imv_qrcode);
        try {
            imv_qrcode.setBackground(new BitmapDrawable(CreateTwoDCode("chenss")));
        } catch (WriterException e) {
            e.printStackTrace();
        }

        tvNickName= (TextView) findViewById(R.id.tvNickName);
        tvYongBaoId= (TextView) findViewById(R.id.tvYongBaoId);
        tvTel= (TextView) findViewById(R.id.tvTel);
        tvTel.setText(PreferenceUtils.getUserName(getApplication()));
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
        String url= SystemConfig.URL_LOAD_HEAD;
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
            }

            @Override
            public void onSuccess(int statusCode, Header[] headers, File file) {
                Log.i(getClass().getSimpleName(), getString(R.string.text_success_download));
                Bitmap bm = BitmapFactory.decodeFile(headPath);
                ivHead.setImageBitmap(bm);
            }
        });
    }

    /**
     * 将指定的内容生成成二维码
     *
     * @param content 将要生成二维码的内容
     * @return 返回生成好的二维码事件
     * @throws WriterException WriterException异常
     */
    public Bitmap CreateTwoDCode(String content) throws WriterException {
        //解决中文识别不出来的问题
        Hashtable hints=new Hashtable();
        hints.put(EncodeHintType.CHARACTER_SET,"UTF-8");
        // 生成二维矩阵,编码时指定大小,不要生成了图片以后再进行缩放,这样会模糊导致识别失败
        BitMatrix matrix = new MultiFormatWriter().encode(content,
                BarcodeFormat.QR_CODE, 500, 500,hints);
        int width = matrix.getWidth();
        int height = matrix.getHeight();
        // 二维矩阵转为一维像素数组,也就是一直横着排了
        int[] pixels = new int[width * height];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                if (matrix.get(x, y)) {
                    pixels[y * width + x] = 0xff000000;
                }
            }
        }
        Bitmap bitmap = Bitmap.createBitmap(width, height,
                Bitmap.Config.ARGB_8888);
        // 通过像素数组生成bitmap,具体参考api
        bitmap.setPixels(pixels, 0, width, 0, 0, width, height);

        Bitmap bm1 = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        int[] pix = new int[width * height];
        for (int y = 0; y < height; y++)
            for (int x = 0; x < width; x++)
            {
                int index = y * width + x;
                int r = ((pix[index] >> 16) & 0xff)|0xff;
                int g = ((pix[index] >> 8) & 0xff)|0xff;
                int b =( pix[index] & 0xff)|0xff;
                pix[index] = 0xff000000 | (r << 16) | (g << 8) | b;
                //  pix[index] = 0xff000000;

            }
        bm1.setPixels(pix, 0, width, 0, 0, width, height);

        return mergeBitmap(getRoundedCornerBitmap(bm1),bitmap);
    }

    /**
     * 圆角矩形
     * @param bitmap
     * @return
     */
    public static Bitmap getRoundedCornerBitmap(Bitmap bitmap) {
        Bitmap output = Bitmap.createBitmap(bitmap.getWidth(),
                bitmap.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(output);

        final int color = 0xff424242;
        final Paint paint = new Paint();
        final Rect rect = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
        final RectF rectF = new RectF(rect);
        final float roundPx = 20;

        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        paint.setColor(color);
        canvas.drawRoundRect(rectF, roundPx, roundPx, paint);

        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);

        return output;
    }

    /**
     * 二维码生成后 白色背景用1个bitmap 然后合成 一个bitmap
     * @param firstBitmap
     * @param secondBitmap
     * @return
     */
    private Bitmap mergeBitmap(Bitmap firstBitmap, Bitmap secondBitmap) {
        Bitmap bitmap = Bitmap.createBitmap(firstBitmap.getWidth(), firstBitmap.getHeight(),
                firstBitmap.getConfig());
        Canvas canvas = new Canvas(bitmap);
        canvas.drawBitmap(firstBitmap, new Matrix(), null);
        canvas.drawBitmap(secondBitmap, 0, 0, null);
        return bitmap;
    }

    /**
     * 修改头像
     * @param view
     */
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
        intent.putExtra(SettingActivity.PHOTO_TYPE, index);
        startActivityForResult(intent, SettingActivity.CROP_REQUEST_CODE);
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
        if (requestCode==SettingActivity.CROP_REQUEST_CODE && resultCode== Activity.RESULT_OK){
            /*
            * 头像保存至服务器
            * */
            Bitmap bitmap=data.getExtras().getParcelable(CropActivity.BITMAP_DATA);
            uploadHeadToServer();
        }
    }

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
                HeadChanged=true;
                Toast.makeText(getApplication(), getString(R.string.text_success_headLoad), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, byte[] responseBody, Throwable error) {
                Toast.makeText(getApplication(), getString(R.string.text_server_out), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
