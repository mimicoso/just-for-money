package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import java.util.*
import androidx.lifecycle.viewmodel.compose.viewModel
import com.yangyang.accounting.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BudgetScreen(navController: NavHostController) {
    val viewModel: MainViewModel = viewModel()

    var monthlyBudget by remember { mutableStateOf("5000") }
    var yearlyBudget by remember { mutableStateOf("60000") }
    var editingMonthly by remember { mutableStateOf(false) }
    var editingYearly by remember { mutableStateOf(false) }

    val calendar = Calendar.getInstance()
    val currentYear = calendar.get(Calendar.YEAR)
    val currentMonth = calendar.get(Calendar.MONTH) + 1

    val monthlyUsed = 3200.0
    val yearlyUsed = 28500.0

    val monthlyProgress = (monthlyUsed / (monthlyBudget.toDoubleOrNull() ?: 5000.0)) * 100
    val yearlyProgress = (yearlyUsed / (yearlyBudget.toDoubleOrNull() ?: 60000.0)) * 100

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
                        text = "预算管理",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A202C),
                        modifier = Modifier.weight(1f),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.White)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .background(Color(0xFF4A90D9).copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Filled.Wallet, contentDescription = null, tint = Color(0xFF4A90D9))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(text = "月度预算", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF1A202C))
                                Text(text = "${currentYear}年${currentMonth}月", fontSize = 12.sp, color = Color(0xFF718096))
                            }
                        }
                        if (editingMonthly) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                IconButton(onClick = {
                                    editingMonthly = false
                                }) {
                                    Icon(Icons.Filled.Check, contentDescription = "保存", tint = Color(0xFF4A90D9))
                                }
                                IconButton(onClick = {
                                    monthlyBudget = "5000"
                                    editingMonthly = false
                                }) {
                                    Icon(Icons.Filled.Close, contentDescription = "取消", tint = Color(0xFF718096))
                                }
                            }
                        } else {
                            TextButton(onClick = { editingMonthly = true }) {
                                Text("修改", color = Color(0xFF4A90D9))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (editingMonthly) {
                        OutlinedTextField(
                            value = monthlyBudget,
                            onValueChange = { monthlyBudget = it },
                            modifier = Modifier.fillMaxWidth(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true
                        )
                    } else {
                        Text(text = "¥$monthlyBudget", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("已使用", fontSize = 12.sp, color = Color(0xFF718096))
                        Text("¥${String.format("%.2f", monthlyUsed)}", fontSize = 12.sp, color = Color(0xFF1A202C))
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("剩余", fontSize = 12.sp, color = Color(0xFF718096))
                        Text(
                            "¥${String.format("%.2f", monthlyBudget.toDouble() - monthlyUsed)}",
                            fontSize = 12.sp,
                            color = if (monthlyBudget.toDouble() - monthlyUsed < 0) Color(0xFFE53935) else Color(0xFF43A047)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    LinearProgressIndicator(
                        progress = { (monthlyProgress / 100.0).toFloat().coerceIn(0f, 1f) },
                        modifier = Modifier.fillMaxWidth().height(8.dp),
                        color = when {
                            monthlyProgress > 100 -> Color(0xFFE53935)
                            monthlyProgress > 80 -> Color(0xFFFF9800)
                            else -> Color(0xFF4A90D9)
                        },
                        trackColor = Color(0xFFE2E8F0)
                    )

                    Text(
                        text = if (monthlyProgress > 100) "已超支" else "已使用${String.format("%.1f", monthlyProgress)}%",
                        fontSize = 12.sp,
                        color = Color(0xFF718096),
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = androidx.compose.ui.text.style.TextAlign.End
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.White)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .background(Color(0xFF43A047).copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Filled.TrendingDown, contentDescription = null, tint = Color(0xFF43A047))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(text = "年度预算", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF1A202C))
                                Text(text = "${currentYear}年度", fontSize = 12.sp, color = Color(0xFF718096))
                            }
                        }
                        if (editingYearly) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                IconButton(onClick = {
                                    editingYearly = false
                                }) {
                                    Icon(Icons.Filled.Check, contentDescription = "保存", tint = Color(0xFF4A90D9))
                                }
                                IconButton(onClick = {
                                    yearlyBudget = "60000"
                                    editingYearly = false
                                }) {
                                    Icon(Icons.Filled.Close, contentDescription = "取消", tint = Color(0xFF718096))
                                }
                            }
                        } else {
                            TextButton(onClick = { editingYearly = true }) {
                                Text("修改", color = Color(0xFF4A90D9))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (editingYearly) {
                        OutlinedTextField(
                            value = yearlyBudget,
                            onValueChange = { yearlyBudget = it },
                            modifier = Modifier.fillMaxWidth(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true
                        )
                    } else {
                        Text(text = "¥$yearlyBudget", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("已使用", fontSize = 12.sp, color = Color(0xFF718096))
                        Text("¥${String.format("%.2f", yearlyUsed)}", fontSize = 12.sp, color = Color(0xFF1A202C))
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("剩余", fontSize = 12.sp, color = Color(0xFF718096))
                        Text(
                            "¥${String.format("%.2f", yearlyBudget.toDouble() - yearlyUsed)}",
                            fontSize = 12.sp,
                            color = if (yearlyBudget.toDouble() - yearlyUsed < 0) Color(0xFFE53935) else Color(0xFF43A047)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    LinearProgressIndicator(
                        progress = { (yearlyProgress / 100.0).toFloat().coerceIn(0f, 1f) },
                        modifier = Modifier.fillMaxWidth().height(8.dp),
                        color = when {
                            yearlyProgress > 100 -> Color(0xFFE53935)
                            yearlyProgress > 80 -> Color(0xFFFF9800)
                            else -> Color(0xFF43A047)
                        },
                        trackColor = Color(0xFFE2E8F0)
                    )

                    Text(
                        text = if (yearlyProgress > 100) "已超支" else "已使用${String.format("%.1f", yearlyProgress)}%",
                        fontSize = 12.sp,
                        color = Color(0xFF718096),
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = androidx.compose.ui.text.style.TextAlign.End
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color(0xFF4A90D9).copy(alpha = 0.1f))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Filled.Info, contentDescription = null, tint = Color(0xFF4A90D9))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "💡 小贴士\n设置合理的预算有助于更好地控制支出。当支出超过预算的80%时，进度条会变成橙色提醒您注意；超过100%时会变成红色。",
                        fontSize = 12.sp,
                        color = Color(0xFF4A90D9)
                    )
                }
            }
        }
    }
}