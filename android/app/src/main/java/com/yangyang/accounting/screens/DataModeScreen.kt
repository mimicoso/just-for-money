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
fun DataModeScreen(navController: NavHostController) {
    var selectedMode by remember { mutableStateOf(0) }
    val modes = listOf(
        Pair("本地模式", "数据仅保存在本地设备"),
        Pair("云同步模式", "数据自动同步到云端")
    )

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
                        text = "数据模式",
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
            modes.forEachIndexed { index, mode ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedMode = index },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        if (selectedMode == index) Color(0xFF4A90D9).copy(alpha = 0.1f)
                        else Color.White
                    )
                ) {
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
                                    .size(40.dp)
                                    .background(
                                        if (selectedMode == index) Color(0xFF4A90D9).copy(alpha = 0.1f)
                                        else Color(0xFFF5F5F5),
                                        RoundedCornerShape(12.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    if (index == 0) Icons.Filled.Storage else Icons.Filled.Cloud,
                                    contentDescription = null,
                                    tint = if (selectedMode == index) Color(0xFF4A90D9) else Color(0xFF718096)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = mode.first,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = if (selectedMode == index) Color(0xFF4A90D9) else Color(0xFF1A202C)
                                )
                                Text(
                                    text = mode.second,
                                    fontSize = 12.sp,
                                    color = Color(0xFF718096)
                                )
                            }
                        }
                        if (selectedMode == index) {
                            Icon(
                                Icons.Filled.Check,
                                contentDescription = null,
                                tint = Color(0xFF4A90D9)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color(0xFF4A90D9).copy(alpha = 0.05f))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Filled.Info, contentDescription = null, tint = Color(0xFF4A90D9))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "💡 提示：云同步模式需要登录账户才能使用，切换模式不会丢失本地数据。",
                        fontSize = 12.sp,
                        color = Color(0xFF4A90D9)
                    )
                }
            }
        }
    }
}