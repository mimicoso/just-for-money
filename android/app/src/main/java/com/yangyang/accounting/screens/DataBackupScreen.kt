package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
fun DataBackupScreen(navController: NavHostController) {
    var localAutoBackup by remember { mutableStateOf(true) }
    var cloudAutoBackup by remember { mutableStateOf(true) }

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
                        text = "数据备份",
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
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = Color(0xFFF5F5F5),
                        shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
                    ) {
                        Text(
                            text = "本地备份",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF718096),
                            modifier = Modifier.padding(12.dp)
                        )
                    }

                    BackupItem(
                        title = "数据迁移",
                        subtitle = "将一台设备的数据迁移至另一台设备",
                        icon = Icons.Filled.Sync,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    BackupItem(
                        title = "执行本地备份",
                        subtitle = "Documents/一木记账/",
                        icon = Icons.Filled.Download,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    BackupItem(
                        title = "恢复本地备份",
                        subtitle = "选择本地数据文件，恢复软件数据",
                        icon = Icons.Filled.Upload,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
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
                                Icon(Icons.Filled.Cloud, contentDescription = null, tint = Color(0xFF4A90D9))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "本地自动备份",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Color(0xFF1A202C)
                                )
                                Text(
                                    text = "在进入和退出应用时进行一次数据备份",
                                    fontSize = 12.sp,
                                    color = Color(0xFF718096)
                                )
                            }
                        }
                        Switch(
                            checked = localAutoBackup,
                            onCheckedChange = { localAutoBackup = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color(0xFF43A047),
                                checkedTrackColor = Color(0xFF43A047).copy(alpha = 0.5f)
                            )
                        )
                    }
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.White)
            ) {
                Column {
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = Color(0xFFF5F5F5),
                        shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
                    ) {
                        Text(
                            text = "WebDAV备份",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF718096),
                            modifier = Modifier.padding(12.dp)
                        )
                    }

                    BackupItem(
                        title = "网盘参数配置",
                        subtitle = "将备份文件同步至支持WebDAV...",
                        icon = Icons.Filled.Settings,
                        showRightArrow = true,
                        rightText = "未配置",
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    BackupItem(
                        title = "执行网盘备份",
                        subtitle = "将数据文件存储在配置的网盘中",
                        icon = Icons.Filled.Download,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    BackupItem(
                        title = "恢复网盘备份",
                        subtitle = "恢复网盘备份的数据文件",
                        icon = Icons.Filled.Upload,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    BackupItem(
                        title = "备份文件管理",
                        subtitle = "删除远程备份的数据文件",
                        icon = Icons.Filled.Folder,
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    BackupItem(
                        title = "每日自动备份次数",
                        subtitle = "设置每日自动备份次数，节省流量",
                        icon = Icons.Filled.Timer,
                        showRightArrow = true,
                        rightText = "无限制",
                        onClick = { }
                    )
                    Divider(color = Color(0xFFF0F5FA))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
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
                                Icon(Icons.Filled.Cloud, contentDescription = null, tint = Color(0xFF4A90D9))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "网盘自动备份",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Color(0xFF1A202C)
                                )
                                Text(
                                    text = "在应用正常退出时进行一次数据备份",
                                    fontSize = 12.sp,
                                    color = Color(0xFF718096)
                                )
                            }
                        }
                        Switch(
                            checked = cloudAutoBackup,
                            onCheckedChange = { cloudAutoBackup = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color(0xFF43A047),
                                checkedTrackColor = Color(0xFF43A047).copy(alpha = 0.5f)
                            )
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun BackupItem(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    showRightArrow: Boolean = false,
    rightText: String = "",
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
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
                Icon(icon, contentDescription = null, tint = Color(0xFF4A90D9))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF1A202C)
                )
                Text(
                    text = subtitle,
                    fontSize = 12.sp,
                    color = Color(0xFF718096)
                )
            }
        }
        if (showRightArrow) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (rightText.isNotEmpty()) {
                    Text(
                        text = rightText,
                        fontSize = 12.sp,
                        color = Color(0xFF718096)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                }
                Icon(Icons.Filled.ChevronRight, contentDescription = null, tint = Color(0xFFCBD5E0))
            }
        }
    }
}