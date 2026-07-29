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
import com.yangyang.accounting.data.Account
import com.yangyang.accounting.navigation.Screen
import com.yangyang.accounting.viewmodel.MainViewModel

@Composable
fun AccountsScreen(navController: NavHostController) {
    val viewModel: MainViewModel = viewModel()
    val transactions by viewModel.transactions.collectAsState()

    val accounts = listOf(
        Account("1", "招商银行9345", "fund", 2164.29, null),
        Account("2", "网商银行", "fund", 0.0, null),
        Account("3", "家庭小荷包", "fund", 0.0, null),
        Account("4", "深圳通", "recharge", 0.0, null),
        Account("5", "蚂蚁花呗", "credit", 0.0, null),
        Account("6", "建设银行信用卡", "credit", 0.0, null)
    )

    val totalAssets = accounts.filter { it.type in listOf("fund", "recharge", "investment") }.sumOf { it.balance }
    val totalLiabilities = accounts.filter { it.type == "credit" }.sumOf { it.balance }
    val netWorth = totalAssets - totalLiabilities

    var showAddDialog by remember { mutableStateOf(false) }
    var newAccountName by remember { mutableStateOf("") }
    var newAccountType by remember { mutableStateOf("fund") }

    Scaffold(
        bottomBar = { BottomNav(navController = navController, currentScreen = Screen.Accounts.route) }
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF0F5FA))
            .padding(padding)) {

            Card(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color(0xFF5B9BD5))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(text = "净资产", fontSize = 12.sp, color = Color.White.copy(0.9f), modifier = Modifier.padding(bottom = 4.dp))
                    Text(text = "¥${formatCurrency(netWorth)}", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "总资产", fontSize = 12.sp, color = Color.White.copy(0.8f))
                            Text(text = "¥${formatCurrency(totalAssets)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "总负债", fontSize = 12.sp, color = Color.White.copy(0.8f))
                            Text(text = "¥${formatCurrency(totalLiabilities)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }

            Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(text = "账户列表", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                Button(onClick = { showAddDialog = true }) {
                    Text(text = "添加账户")
                }
            }

            LazyColumn(modifier = Modifier.weight(1f)) {
                items(accounts.size) { index ->
                    val account = accounts[index]
                    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp), shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column {
                                Text(text = account.name, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                                Text(text = getAccountTypeName(account.type), fontSize = 12.sp, color = Color(0xFF718096))
                            }
                            Text(text = "¥${formatCurrency(account.balance)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text(text = "添加账户") },
            text = {
                Column {
                    OutlinedTextField(
                        value = newAccountName,
                        onValueChange = { newAccountName = it },
                        label = { Text(text = "账户名称") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(text = "账户类型", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Row {
                        listOf("fund", "recharge", "credit", "investment").forEach { type ->
                            Button(
                                onClick = { newAccountType = type },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(
                                    if (newAccountType == type) Color(0xFF4A90D9) else Color(0xFFE2E8F0)
                                )
                            ) {
                                Text(text = getAccountTypeName(type), fontSize = 10.sp, color = if (newAccountType == type) Color.White else Color(0xFF718096))
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(onClick = {
                    if (newAccountName.isNotBlank()) {
                        showAddDialog = false
                        newAccountName = ""
                    }
                }) {
                    Text(text = "添加")
                }
            },
            dismissButton = {
                Button(onClick = {
                    showAddDialog = false
                    newAccountName = ""
                }) {
                    Text(text = "取消")
                }
            }
        )
    }
}

fun getAccountTypeName(type: String): String {
    return when (type) {
        "fund" -> "资金账户"
        "recharge" -> "充值卡"
        "credit" -> "信用卡"
        "investment" -> "投资"
        else -> "其他"
    }
}
