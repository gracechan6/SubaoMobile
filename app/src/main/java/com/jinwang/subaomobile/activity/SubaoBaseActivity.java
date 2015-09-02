package com.jinwang.subaomobile.activity;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import com.jinwang.subaomobile.R;
import com.jinwang.subaomobile.config.SystemConfig;

public class SubaoBaseActivity extends AppCompatActivity
{
    protected Toolbar mToolBar;
    protected TextView mTitle;

    Toolbar.LayoutParams lp;

    /**
     * 条理进度对话框
     */
    protected ProgressDialog mDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mDialog = new ProgressDialog(this);
        mDialog.setCancelable(false);

        //不显示键盘
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
    }

    /**
     * 设置标题
     * @param title
     */
    protected void setTitle(String title)
    {
        this.mTitle.setText(title);
    }

    /**
     * 初始化导航栏
     */
    protected void initToolBar() {
        mToolBar = (Toolbar) findViewById(R.id.toolbar);
        //设置标题
        lp = new Toolbar.LayoutParams(Toolbar.LayoutParams.WRAP_CONTENT, Toolbar.LayoutParams.WRAP_CONTENT);
        lp.gravity = Gravity.CENTER;
        mTitle = new TextView(this);
        mTitle.setTextColor(getResources().getColor(R.color.white));
        mTitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
        mToolBar.addView(mTitle, lp);
    }

    /*设置主界面左侧消息图标*/
    protected void setLeftMsg(){
        mToolBar.setNavigationIcon(R.drawable.icon_message);
        mToolBar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getApplicationContext(), MsgActivity.class));
            }
        });
    }

    /*设置主界面右侧设置图标*/
    protected void setRightSetting(final String muuid){
        mToolBar.inflateMenu(R.menu.menu_setting);
        mToolBar.setOnMenuItemClickListener(new Toolbar.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                Intent intent = new Intent(getApplicationContext(), SettingActivity.class);
                intent.putExtra(SystemConfig.KEY_Muuid,muuid);
                startActivity(intent);
                return true;
            }
        });
    }

    /*设置后退icon*/
    protected void setLeftBack(){
        mToolBar.setNavigationIcon(R.drawable.icon_back);
        mToolBar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    /*设置注册*/
    protected void setRightRegist(){
        mToolBar.inflateMenu(R.menu.menu_register);
        mToolBar.setOnMenuItemClickListener(new Toolbar.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                Intent intent = new Intent(getApplicationContext(), RegisterActivity.class);
                startActivity(intent);
                return true;
            }
        });
    }

    /**
     * 回退到主界面
     */
    protected void gotoMainActivity()
    {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mDialog.dismiss();
    }



    @Override
    protected void onStart() {
        super.onStart();
    }
}
