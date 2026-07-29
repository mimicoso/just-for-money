package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.yangyang.accounting.components.BottomNav
import com.yangyang.accounting.navigation.Screen

@Composable
fun ProfileScreen(navController: NavHostController) {
    val menuItems = listOf(
        MenuItem("账本管理", "管理多个账本"),
        MenuItem("预算设置", "设置月度/年度预算"),
        MenuItem("周期记账", "设置自动记账"),
        MenuItem("日历视图", "按日期查看账单"),
        MenuItem("数据备份", "导出/导入数据"),
        MenuItem("分类管理", "管理收支分类"),
        MenuItem("图标管理", "自定义图标"),
        MenuItem("主题设置", "切换主题"),
        MenuItem("关于", "关于应用")
    )

    Scaffold(
        bottomBar = { BottomNav(navController = navController, currentScreen = Screen.Profile.route) }
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF0F5FA))
            .padding(padding)) {

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(bottomStart = 24.dp, bottomEnd = 24.dp),
                colors = CardDefaults.cardColors(Color(0xFF4A90D9))
            ) {
                Column(modifier = Modifier.padding(32.dp)) {
                    Box(modifier = Modifier.size(80.dp).background(Color.White.copy(0.2f), shape = RoundedCornerShape(50)))
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(text = "羊羊记账", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(text = "个人账本", fontSize = 14.sp, color = Color.White.copy(0.8f))
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column {
                    menuItems.forEachIndexed { index, item ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                                .padding(vertical = if (index == 0) 16.dp else 0.dp)
                                .padding(bottom = 16.dp)
                                .clickable { },
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(text = item.title, fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF1A202C))
                                Text(text = item.description, fontSize = 12.sp, color = Color(0xFF718096))
                            }
                            Icon(Icons.Filled.ChevronRight, contentDescription = null, tint = Color(0xFFA0AEC0))
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Text(text = "版本 1.0.0", fontSize = 12.sp, color = Color(0xFFA0AEC0), textAlign = androidx.compose.ui.text.style.TextAlign.Center, modifier = Modifier.fillMaxWidth())
        }
    }
}

data class MenuItem(val title: String, val description: String)
