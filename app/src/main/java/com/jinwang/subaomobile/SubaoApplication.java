package com.jinwang.subaomobile;

import android.app.Application;
import android.content.res.Configuration;

import com.loopj.android.http.AsyncHttpClient;


public class SubaoApplication extends Application {


    private AsyncHttpClient sharedHttpClient;

    public AsyncHttpClient getSharedHttpClient(){
        return sharedHttpClient;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        sharedHttpClient=new AsyncHttpClient();
    }
}
