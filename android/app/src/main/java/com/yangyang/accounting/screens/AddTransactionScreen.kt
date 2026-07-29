package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
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
import com.yangyang.accounting.components.formatCurrency
import com.yangyang.accounting.data.Transaction
import com.yangyang.accounting.navigation.Screen
import com.yangyang.accounting.viewmodel.MainViewModel
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddTransactionScreen(navController: NavHostController) {
    val viewModel: MainViewModel = viewModel()
    val activeLedgerId by viewModel.activeLedgerId.collectAsState()

    var type by remember { mutableStateOf("expense") }
    var amount by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("") }
    var subcategory by remember { mutableStateOf("") }
    var account by remember { mutableStateOf("") }
    var date by remember { mutableStateOf(LocalDate.now().toString()) }
    var note by remember { mutableStateOf("") }
    var discount by remember { mutableStateOf("") }

    val expenseCategories = mapOf(
        "吃吃喝喝" to listOf("一日三餐", "咖啡饮料", "零食小吃", "外卖"),
        "交通开支" to listOf("公共交通", "打车", "加油", "停车"),
        "房租水电" to listOf("房租", "水电费", "物业费"),
        "购物消费" to listOf("服装", "日用品", "电子产品"),
        "娱乐运动" to listOf("电影", "游戏", "运动健身"),
        "医疗健康" to listOf("看病", "体检", "药品"),
        "教育学习" to listOf("书籍", "课程", "培训"),
        "其他" to listOf("其他")
    )

    val incomeCategories = mapOf(
        "工资" to listOf("基本工资", "奖金"),
        "理财盈利" to listOf("理财收入", "股票收益"),
        "兼职" to listOf("兼职", "副业"),
        "其他" to listOf("其他")
    )

    val accounts = listOf("招商银行9345", "网商银行", "家庭小荷包", "深圳通", "蚂蚁花呗", "建设银行信用卡", "现金")

    val categories = if (type == "expense") expenseCategories else incomeCategories

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "记一笔") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = null)
                    }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF0F5FA))
            .padding(padding)
            .verticalScroll(rememberScrollState())) {

            Row(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                listOf("支出", "收入", "转账").forEach { t ->
                    Button(
                        onClick = { type = t.lowercase() },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            if (type == t.lowercase()) Color(0xFF4A90D9) else Color(0xFFE2E8F0)
                        )
                    ) {
                        Text(text = t, color = if (type == t.lowercase()) Color.White else Color(0xFF718096))
                    }
                }
            }

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "金额", fontSize = 12.sp, color = Color(0xFF718096), modifier = Modifier.padding(bottom = 8.dp))
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(text = "¥", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                        OutlinedTextField(
                            value = amount,
                            onValueChange = { amount = it.replace("[^0-9.]".toRegex(), "") },
                            placeholder = { Text(text = "0.00") },
                            modifier = Modifier.weight(1f),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 28.sp, fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "分类", fontSize = 12.sp, color = Color(0xFF718096), modifier = Modifier.padding(bottom = 8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        categories.keys.forEach { cat ->
                            Button(
                                onClick = {
                                    category = cat
                                    subcategory = categories[cat]?.first() ?: ""
                                },
                                colors = ButtonDefaults.buttonColors(
                                    if (category == cat) Color(0xFFE3F2FD) else Color(0xFFF7FAFC)
                                ),
                                modifier = Modifier.wrapContentWidth()
                            ) {
                                Text(text = cat, fontSize = 12.sp, color = if (category == cat) Color(0xFF4A90D9) else Color(0xFF718096))
                            }
                        }
                    }
                    if (category.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            categories[category]?.forEach { sub ->
                                Button(
                                    onClick = { subcategory = sub },
                                    colors = ButtonDefaults.buttonColors(
                                        if (subcategory == sub) Color(0xFF4A90D9) else Color(0xFFE2E8F0)
                                    ),
                                    modifier = Modifier.wrapContentWidth()
                                ) {
                                    Text(text = sub, fontSize = 12.sp, color = if (subcategory == sub) Color.White else Color(0xFF718096))
                                }
                            }
                        }
                    }
                }
            }

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "账户", fontSize = 12.sp, color = Color(0xFF718096), modifier = Modifier.padding(bottom = 8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        accounts.forEach { acc ->
                            Button(
                                onClick = { account = acc },
                                colors = ButtonDefaults.buttonColors(
                                    if (account == acc) Color(0xFF4A90D9) else Color(0xFFE2E8F0)
                                ),
                                modifier = Modifier.wrapContentWidth()
                            ) {
                                Text(text = acc, fontSize = 12.sp, color = if (account == acc) Color.White else Color(0xFF718096))
                            }
                        }
                    }
                }
            }

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "日期", fontSize = 12.sp, color = Color(0xFF718096), modifier = Modifier.padding(bottom = 8.dp))
                    OutlinedTextField(
                        value = date,
                        onValueChange = { date = it },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            if (type == "expense") {
                Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "优惠金额", fontSize = 12.sp, color = Color(0xFF718096), modifier = Modifier.padding(bottom = 8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "¥", fontSize = 16.sp, color = Color(0xFF1A202C))
                            OutlinedTextField(
                                value = discount,
                                onValueChange = { discount = it.replace("[^0-9.]".toRegex(), "") },
                                placeholder = { Text(text = "0.00") },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            Card(modifier = Modifier.fillMaxWidth().padding(16.dp), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "备注", fontSize = 12.sp, color = Color(0xFF718096), modifier = Modifier.padding(bottom = 8.dp))
                    OutlinedTextField(
                        value = note,
                        onValueChange = { note = it },
                        placeholder = { Text(text = "添加备注...") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = {
                    if (amount.isNotBlank() && category.isNotEmpty() && account.isNotEmpty()) {
                        val finalAmount = amount.toDouble() - discount.toDoubleOrNull()!!
                        val transaction = Transaction(
                            id = System.currentTimeMillis().toString(),
                            ledgerId = activeLedgerId,
                            type = type,
                            amount = finalAmount,
                            category = category,
                            subcategory = subcategory,
                            account = account,
                            date = date,
                            note = if (discount.isNotBlank() && discount.toDouble() > 0) "$note (优惠¥${formatCurrency(discount.toDouble())})" else note
                        )
                        viewModel.addTransaction(transaction)
                        navController.popBackStack()
                    }
                },
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                colors = ButtonDefaults.buttonColors(Color(0xFF4A90D9))
            ) {
                Text(text = "保存", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
