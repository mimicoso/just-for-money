# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Capacitor WebView 规则
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-dontwarn com.getcapacitor.**
-dontwarn com.capacitorjs.**

# WebView JavaScript 接口
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 保留 JavaScript 接口类
-keepclassmembers class com.getcapacitor.bridge.** {
    public *;
}

# 如果项目使用 WebView with JS
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
    public *;
}

# 保留行号信息用于调试
-keepattributes SourceFile,LineNumberTable

# 保留泛型信息
-keepattributes Signature

# 保留注解
-keepattributes *Annotation*

# 不警告 missing classes
-dontwarn com.getcapacitor.**
-dontwarn com.capacitorjs.**
