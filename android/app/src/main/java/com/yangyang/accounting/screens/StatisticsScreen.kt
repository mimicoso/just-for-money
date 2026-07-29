package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import com.yangyang.accounting.navigation.Screen
import com.yangyang.accounting.viewmodel.MainViewModel
import java.time.LocalDate

@Composable
fun StatisticsScreen(navController: NavHostController) {
    val viewModel: MainViewModel = viewModel()
    val transactions by viewModel.transactions.collectAsState()
    val summary by viewModel.monthlySummary.collectAsState()

    var activeTab by remember { mutableStateOf("month") }
    var chartType by remember { mutableStateOf("expense") }

    val now = LocalDate.now()
    val monthTransactions = transactions.filter { it.date.startsWith("${now.year}-${String.format("%02d", now.monthValue)}") }
    val categoryStats = monthTransactions
        .filter { it.type == chartType }
        .groupBy { it.category }
        .map { (name, items) ->
            val amount = items.sumOf { it.amount }
            val count = items.size
            val percentage = if (monthTransactions.filter { it.type == chartType }.sumOf { it.amount } > 0) {
                (amount / monthTransactions.filter { it.type == chartType }.sumOf { it.amount } * 100)
            } else 0.0
            Triple(name, amount, percentage)
        }
        .sortedByDescending { it.second }

    Scaffold(
        bottomBar = { BottomNav(navController = navController, currentScreen = Screen.Statistics.route) }
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF0F5FA))
            .padding(padding)
            .verticalScroll(rememberScrollState())) {

            Row(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                listOf("日常", "月统计", "年统计", "资产统计").forEach { tab ->
                    Button(
                        onClick = { activeTab = tab },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            if (activeTab == tab) Color(0xFFE3F2FD) else Color(0xFFE2E8F0)
                        )
                    ) {
                        Text(text = tab, fontSize = 12.sp, color = if (activeTab == tab) Color(0xFF4A90D9) else Color(0xFF718096))
                    }
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color(0xFF5B9BD5))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = if (chartType == "income") "总收入" else if (chartType == "balance") "总结余" else "总支出", fontSize = 12.sp, color = Color.White.copy(0.9f), modifier = Modifier.padding(bottom = 4.dp))
                            Text(text = "¥${formatCurrency(if (chartType == "income") summary.income else if (chartType == "balance") summary.balance else summary.expense)}", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "收入", fontSize = 12.sp, color = Color.White.copy(0.8f), modifier = Modifier.padding(bottom = 4.dp))
                            Text(text = "¥${formatCurrency(summary.income)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(text = "支出", fontSize = 12.sp, color = Color.White.copy(0.8f), modifier = Modifier.padding(bottom = 4.dp))
                            Text(text = "¥${formatCurrency(summary.expense)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = "收支统计", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                        Row {
                            listOf("支出", "收入", "结余").forEach { t ->
                                Button(
                                    onClick = { chartType = t.lowercase() },
                                    colors = ButtonDefaults.buttonColors(
                                        if (chartType == t.lowercase()) Color(0xFF4A90D9) else Color(0xFFE2E8F0)
                                    )
                                ) {
                                    Text(text = t, fontSize = 12.sp, color = if (chartType == t.lowercase()) Color.White else Color(0xFF718096))
                                }
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Box(modifier = Modifier.height(150.dp).background(Color(0xFFF7FAFC), shape = RoundedCornerShape(8.dp)))
                }
            }

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "分类排行", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C), modifier = Modifier.padding(bottom = 12.dp))
                    categoryStats.forEach { (name, amount, percentage) ->
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = name, fontSize = 14.sp, color = Color(0xFF1A202C))
                                LinearProgressIndicator(
                                    progress = { percentage.toFloat() / 100 },
                                    modifier = Modifier.height(6.dp).padding(top = 4.dp),
                                    color = Color(0xFF4A90D9)
                                )
                            }
                            Text(text = "¥${formatCurrency(amount)}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A90D9))
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
