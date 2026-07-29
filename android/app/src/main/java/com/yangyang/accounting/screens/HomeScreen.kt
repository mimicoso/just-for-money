package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.yangyang.accounting.components.BottomNav
import com.yangyang.accounting.components.SummaryCard
import com.yangyang.accounting.components.TransactionItem
import com.yangyang.accounting.components.formatCurrency
import com.yangyang.accounting.data.Ledger
import com.yangyang.accounting.navigation.Screen
import com.yangyang.accounting.viewmodel.MainViewModel

@Composable
fun HomeScreen(navController: NavHostController) {
    val viewModel: MainViewModel = viewModel()
    val transactions by viewModel.transactions.collectAsState()
    val summary by viewModel.monthlySummary.collectAsState()
    val ledgers by viewModel.ledgers.collectAsState()
    val activeLedgerId by viewModel.activeLedgerId.collectAsState()

    val activeLedger = ledgers.find { it.id == activeLedgerId }

    var showLedgerPicker by remember { mutableStateOf(false) }
    var showAddLedger by remember { mutableStateOf(false) }
    var newLedgerName by remember { mutableStateOf("") }
    var selectMode by remember { mutableStateOf(false) }
    var selectedIds by remember { mutableStateOf<List<String>>(emptyList()) }
    var actionDialog by remember { mutableStateOf(false) }
    var deleteDialog by remember { mutableStateOf(false) }
    var targetTransaction by remember { mutableStateOf<com.yangyang.accounting.data.Transaction?>(null) }

    val groupedTransactions = transactions.groupBy { it.date }
    val sortedDates = groupedTransactions.keys.sortedDescending()

    Scaffold(
        bottomBar = { BottomNav(navController = navController, currentScreen = Screen.Home.route) }
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF0F5FA))
            .padding(padding)) {

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (!selectMode && transactions.isNotEmpty()) {
                    Text(
                        text = "编辑",
                        fontSize = 14.sp,
                        color = Color(0xFF4A90D9),
                        modifier = Modifier.clickable {
                            selectMode = true
                            selectedIds = emptyList()
                        }
                    )
                }
                Text(
                    text = activeLedger?.name ?: "个人账本",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1A202C),
                    modifier = Modifier.clickable { showLedgerPicker = true }
                )
                Spacer(modifier = Modifier.width(32.dp))
            }

            if (selectMode) {
                Surface(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (selectedIds.size == transactions.size) "取消全选" else "全选",
                            fontSize = 14.sp,
                            color = Color(0xFF718096),
                            modifier = Modifier.clickable {
                                selectedIds = if (selectedIds.size == transactions.size) emptyList() else transactions.map { it.id }
                            }
                        )
                        Row(modifier = Modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(text = "已选 ${selectedIds.size} 项", fontSize = 14.sp, color = Color(0xFF718096))
                            Text(
                                text = "取消",
                                fontSize = 14.sp,
                                color = Color(0xFF718096),
                                modifier = Modifier.clickable {
                                    selectMode = false
                                    selectedIds = emptyList()
                                }
                            )
                            Button(
                                onClick = { deleteDialog = true },
                                enabled = selectedIds.isNotEmpty(),
                                colors = ButtonDefaults.buttonColors(Color(0xFFE53935))
                            ) {
                                Text(text = "删除", color = Color.White)
                            }
                        }
                    }
                }
            }

            SummaryCard(summary = summary, budget = 5000.0)

            LazyColumn(modifier = Modifier.weight(1f)) {
                sortedDates.forEach { date ->
                    items(1) {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 8.dp),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                val dayTransactions = groupedTransactions[date] ?: emptyList()
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text(text = formatDate(date), fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A202C))
                                    val dayIncome = dayTransactions.filter { it.type == "income" }.sumOf { it.amount }
                                    val dayExpense = dayTransactions.filter { it.type == "expense" }.sumOf { it.amount }
                                    Row {
                                        Text(text = "收 ¥${formatCurrency(dayIncome)}", fontSize = 12.sp, color = Color(0xFF43A047), modifier = Modifier.padding(end = 8.dp))
                                        Text(text = "支 ¥${formatCurrency(dayExpense)}", fontSize = 12.sp, color = Color(0xFFE53935))
                                    }
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                dayTransactions.forEach { transaction ->
                                    TransactionItem(
                                        transaction = transaction,
                                        onClick = {
                                            if (selectMode) {
                                                selectedIds = if (selectedIds.contains(transaction.id)) {
                                                    selectedIds.filter { it != transaction.id }
                                                } else {
                                                    selectedIds + transaction.id
                                                }
                                            }
                                        },
                                        onLongClick = {
                                            if (!selectMode) {
                                                targetTransaction = transaction
                                                actionDialog = true
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showLedgerPicker) {
        AlertDialog(
            onDismissRequest = { showLedgerPicker = false },
            title = { Text(text = "选择账本") },
            text = {
                Column {
                    ledgers.forEach { ledger ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(8.dp)
                                .clickable {
                                    viewModel.setActiveLedger(ledger.id)
                                    showLedgerPicker = false
                                },
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = ledger.name, fontSize = 16.sp)
                            if (ledger.id == activeLedgerId) {
                                Icon(Icons.Filled.Check, contentDescription = null, tint = Color(0xFF4A90D9))
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(onClick = { showAddLedger = true }) {
                        Text(text = "新建账本")
                    }
                }
            },
            confirmButton = {}
        )
    }

    if (showAddLedger) {
        AlertDialog(
            onDismissRequest = { showAddLedger = false },
            title = { Text(text = "新建账本") },
            text = {
                OutlinedTextField(
                    value = newLedgerName,
                    onValueChange = { newLedgerName = it },
                    label = { Text(text = "账本名称") },
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(onClick = {
                    if (newLedgerName.isNotBlank()) {
                        viewModel.addLedger(newLedgerName)
                        newLedgerName = ""
                        showAddLedger = false
                    }
                }) {
                    Text(text = "创建")
                }
            },
            dismissButton = {
                Button(onClick = {
                    newLedgerName = ""
                    showAddLedger = false
                }) {
                    Text(text = "取消")
                }
            }
        )
    }

    if (actionDialog) {
        AlertDialog(
            onDismissRequest = { actionDialog = false },
            title = { Text(text = targetTransaction?.category ?: "") },
            text = {
                Column {
                    Button(onClick = {
                        navController.navigate(Screen.AddTransaction.route)
                        actionDialog = false
                    }) {
                        Text(text = "编辑")
                    }
                    Button(onClick = {
                        actionDialog = false
                        deleteDialog = true
                    }) {
                        Text(text = "删除")
                    }
                }
            },
            confirmButton = {}
        )
    }

    if (deleteDialog) {
        AlertDialog(
            onDismissRequest = { deleteDialog = false },
            title = { Text(text = "确认删除") },
            text = {
                Text(text = if (selectedIds.isNotEmpty()) "是否删除选中的 ${selectedIds.size} 条账单？" else "是否删除该账单？")
            },
            confirmButton = {
                Button(onClick = {
                    if (selectedIds.isNotEmpty()) {
                        viewModel.deleteTransactions(selectedIds)
                        selectMode = false
                        selectedIds = emptyList()
                    } else {
                        targetTransaction?.let { viewModel.deleteTransaction(it.id) }
                    }
                    deleteDialog = false
                    targetTransaction = null
                }) {
                    Text(text = "删除")
                }
            },
            dismissButton = {
                Button(onClick = { deleteDialog = false }) {
                    Text(text = "取消")
                }
            }
        )
    }
}
