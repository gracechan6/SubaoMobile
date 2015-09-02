package com.jinwang.subaomobile.activity;

import android.os.Bundle;

import com.jinwang.subaomobile.R;
import com.jinwang.subaomobile.config.SystemConfig;


public class MainActivity extends SubaoBaseActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initToolBar();
        setTitle(getResources().getString(R.string.app_name_zh));
        setLeftMsg();
        setRightSetting(getIntent().getStringExtra(SystemConfig.KEY_Muuid));
    }
}
