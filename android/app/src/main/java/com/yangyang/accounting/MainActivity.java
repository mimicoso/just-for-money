package com.yangyang.accounting;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Capacitor 8 支持自动插件注册，无需手动 registerPlugin
        super.onCreate(savedInstanceState);
    }
}
