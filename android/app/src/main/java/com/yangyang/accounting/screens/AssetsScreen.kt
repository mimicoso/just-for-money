package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.yangyang.accounting.components.BottomNav
import com.yangyang.accounting.components.formatCurrency
import com.yangyang.accounting.data.Asset
import com.yangyang.accounting.navigation.Screen
import com.yangyang.accounting.viewmodel.MainViewModel

@Composable
fun AssetsScreen(navController: NavHostController) {
    val viewModel: MainViewModel = viewModel()

    val assets = listOf(
        Asset("1", "笔记本电脑", "电子产品", 5450.0, "2017-10-24", null, 1.71, "active"),
        Asset("2", "燕飞利仕震荡波", "电子产品", 75.0, "2026-06-21", null, 8.33, "active"),
        Asset("3", "神牛 IT32 闪光灯", "电子产品", 370.0, "2026-03-30", null, 3.63, "active"),
        Asset("4", "松下85mm F1.8", "电子产品", 2619.90, "2023-06-17", null, 3.59, "active"),
        Asset("5", "松下s5-2060套机", "电子产品", 8767.22, "2023-06-17", null, 11.64, "active"),
        Asset("6", "燕飞利仕震荡波", "电子产品", 89.0, "2023-08-22", null, 0.08, "active"),
        Asset("7", "显示器", "电子产品", 100.0, "2025-05-21", null, 0.24, "active"),
        Asset("8", "一加 Ace Pro", "电子产品", 2650.0, "2023-01-08", null, 2.12, "active"),
        Asset("9", "OPPO Find X8 Ultra", "电子产品", 6029.05, "2025-06-16", null, 15.50, "active"),
        Asset("10", "OPPO watch 4 Pro", "电子产品", 1625.0, "2024-03-29", null, 1.95, "active")
    )

    val totalValue = assets.sumOf { it.price }
    val totalDailyCost = assets.filter { it.status == "active" }.sumOf { it.dailyCost }

    var categoryFilter by remember { mutableStateOf("所有物品") }
    val categories = listOf("所有物品") + assets.map { it.category }.distinct()

    val filteredAssets = if (categoryFilter == "所有物品") assets else assets.filter { it.category == categoryFilter }

    var showAddDialog by remember { mutableStateOf(false) }
    var newAssetName by remember { mutableStateOf("") }
    var newAssetPrice by remember { mutableStateOf("") }
    var newAssetCategory by remember { mutableStateOf("电子产品") }
    var newAssetDate by remember { mutableStateOf(java.time.LocalDate.now().toString()) }

    Scaffold(
        bottomBar = { BottomNav(navController = navController, currentScreen = Screen.Assets.route) }
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF0F5FA))
            .padding(padding)) {

            Card(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(text = "资产总览", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C), modifier = Modifier.padding(bottom = 12.dp))
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "资产价值", fontSize = 12.sp, color = Color(0xFF718096))
                            Text(text = "¥${formatCurrency(totalValue)}", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "资产数量", fontSize = 12.sp, color = Color(0xFF718096))
                            Text(text = "${assets.size}件", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(text = "日均成本", fontSize = 12.sp, color = Color(0xFF718096))
                            Text(text = "¥${formatCurrency(totalDailyCost)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                        }
                    }
                }
            }

            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                categories.forEach { cat ->
                    Button(
                        onClick = { categoryFilter = cat },
                        colors = ButtonDefaults.buttonColors(
                            if (categoryFilter == cat) Color(0xFF4A90D9) else Color(0xFFE2E8F0)
                        ),
                        modifier = Modifier.wrapContentWidth()
                    ) {
                        Text(text = cat, fontSize = 12.sp, color = if (categoryFilter == cat) Color.White else Color(0xFF718096))
                    }
                }
            }

            LazyColumn(modifier = Modifier.weight(1f)) {
                items(filteredAssets.size) { index ->
                    val asset = filteredAssets[index]
                    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp), shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = asset.name, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                                Text(text = "${asset.category} · ${formatDate(asset.purchaseDate)}", fontSize = 12.sp, color = Color(0xFF718096))
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(text = "¥${formatCurrency(asset.price)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                                Text(text = "日均 ¥${formatCurrency(asset.dailyCost)}", fontSize = 12.sp, color = Color(0xFF43A047))
                            }
                        }
                    }
                }
            }

            Button(
                onClick = { showAddDialog = true },
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                colors = ButtonDefaults.buttonColors(Color(0xFF4A90D9))
            ) {
                Text(text = "添加资产", color = Color.White)
            }
        }
    }

    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text(text = "添加资产") },
            text = {
                Column {
                    OutlinedTextField(
                        value = newAssetName,
                        onValueChange = { newAssetName = it },
                        label = { Text(text = "资产名称") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = newAssetPrice,
                        onValueChange = { newAssetPrice = it.replace("[^0-9.]".toRegex(), "") },
                        label = { Text(text = "价格") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = newAssetDate,
                        onValueChange = { newAssetDate = it },
                        label = { Text(text = "购买日期") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(onClick = {
                    if (newAssetName.isNotBlank() && newAssetPrice.isNotBlank()) {
                        showAddDialog = false
                        newAssetName = ""
                        newAssetPrice = ""
                    }
                }) {
                    Text(text = "添加")
                }
            },
            dismissButton = {
                Button(onClick = {
                    showAddDialog = false
                    newAssetName = ""
                    newAssetPrice = ""
                }) {
                    Text(text = "取消")
                }
            }
        )
    }
}

fun formatDate(date: String): String {
    val parts = date.split("-")
    if (parts.size == 3) {
        return "${parts[1]}月${parts[2]}日"
    }
    return date
}
