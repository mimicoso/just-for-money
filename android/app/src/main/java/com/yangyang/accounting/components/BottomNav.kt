package com.yangyang.accounting.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.yangyang.accounting.navigation.Screen

@Composable
fun BottomNav(navController: androidx.navigation.NavHostController, currentScreen: String) {
    val items = listOf(
        BottomNavItem(Screen.Home.route, "首页"),
        BottomNavItem(Screen.Statistics.route, "统计"),
        BottomNavItem(Screen.Accounts.route, "账户"),
        BottomNavItem(Screen.Assets.route, "资产"),
        BottomNavItem(Screen.Profile.route, "我的")
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(bottom = 20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEach { item ->
                if (item.route == Screen.Accounts.route) {
                    Box(modifier = Modifier.size(56.dp))
                } else {
                    Column(
                        modifier = Modifier
                            .clickable { navController.navigate(item.route) }
                            .padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        val isSelected = currentScreen == item.route
                        Text(
                            text = item.label,
                            fontSize = 12.sp,
                            color = if (isSelected) Color(0xFF4A90D9) else Color(0xFF718096),
                            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                        )
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .offset(y = (-20).dp)
                .size(56.dp)
                .background(Color(0xFF4A90D9), shape = CircleShape)
                .clickable { navController.navigate(Screen.AddTransaction.route) },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "添加",
                tint = Color.White,
                modifier = Modifier.size(32.dp)
            )
        }
    }
}

data class BottomNavItem(val route: String, val label: String)
