package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavHostController) {
    var currency by remember { mutableStateOf("CNY (人民币)") }
    var reminderEnabled by remember { mutableStateOf(false) }
    var biometricEnabled by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Color.White,
                shadowElevation = 2.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "返回", tint = Color(0xFF718096))
                    }
                    Text(
                        text = "设置",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A202C),
                        modifier = Modifier.weight(1f),
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.width(48.dp))
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF0F5FA))
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.White)
            ) {
                Column {
                    SettingItem(
                        title = "货币单位",
                        value = currency,
                        icon = Icons.Filled.AttachMoney,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    SettingItem(
                        title = "记账提醒",
                        value = if (reminderEnabled) "已开启" else "已关闭",
                        icon = Icons.Filled.Notifications,
                        showSwitch = true,
                        switchValue = reminderEnabled,
                        onSwitchChange = { reminderEnabled = it }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    SettingItem(
                        title = "指纹/面容解锁",
                        value = if (biometricEnabled) "已开启" else "未开启",
                        icon = Icons.Filled.Fingerprint,
                        showSwitch = true,
                        switchValue = biometricEnabled,
                        onSwitchChange = { biometricEnabled = it }
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.White)
            ) {
                Column {
                    SettingItem(
                        title = "数据模式",
                        value = "本地模式",
                        icon = Icons.Filled.Storage,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    SettingItem(
                        title = "云同步",
                        value = "未连接",
                        icon = Icons.Filled.Cloud,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    SettingItem(
                        title = "数据备份",
                        value = "",
                        icon = Icons.Filled.Backup,
                        onClick = { }
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.White)
            ) {
                Column {
                    SettingItem(
                        title = "主题设置",
                        value = "海洋蓝",
                        icon = Icons.Filled.Palette,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    SettingItem(
                        title = "图标管理",
                        value = "",
                        icon = Icons.Filled.GridOn,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    SettingItem(
                        title = "关于",
                        value = "版本 1.0.0",
                        icon = Icons.Filled.Info,
                        onClick = { }
                    )
                }
            }
        }
    }
}

@Composable
fun SettingItem(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    showSwitch: Boolean = false,
    switchValue: Boolean = false,
    onSwitchChange: (Boolean) -> Unit = {},
    onClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = !showSwitch) { onClick() }
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(Color(0xFF4A90D9).copy(alpha = 0.1f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = Color(0xFF4A90D9), modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = title,
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF1A202C)
            )
        }
        if (showSwitch) {
            Switch(
                checked = switchValue,
                onCheckedChange = onSwitchChange,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color(0xFF4A90D9),
                    checkedTrackColor = Color(0xFF4A90D9).copy(alpha = 0.5f)
                )
            )
        } else {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (value.isNotEmpty()) {
                    Text(
                        text = value,
                        fontSize = 14.sp,
                        color = Color(0xFF718096)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                }
                Icon(
                    Icons.Filled.ChevronRight,
                    contentDescription = null,
                    tint = Color(0xFFCBD5E0),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}