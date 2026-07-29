package com.yangyang.accounting.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.yangyang.accounting.data.RecurringTransaction
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RecurringScreen(navController: NavHostController) {
    val recurringTransactions = remember { mutableStateListOf<RecurringTransaction>() }

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
                        text = "周期记账",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A202C)
                    )
                }
            }
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { },
                containerColor = Color(0xFF4A90D9),
                modifier = Modifier.size(56.dp)
            ) {
                Icon(Icons.Filled.Add, contentDescription = "添加", tint = Color.White)
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF0F5FA))
                .padding(padding)
        ) {
            if (recurringTransactions.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        Icons.Filled.Repeat,
                        contentDescription = null,
                        tint = Color(0xFFCBD5E0),
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "暂无周期记账",
                        fontSize = 16.sp,
                        color = Color(0xFF718096)
                    )
                    Text(
                        text = "点击下方按钮添加",
                        fontSize = 14.sp,
                        color = Color(0xFFA0AEC0)
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(recurringTransactions.size) { index ->
                        val transaction = recurringTransactions[index]
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(Color.White)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(48.dp)
                                                .background(
                                                    if (transaction.type == "income") Color(0xFF43A047).copy(alpha = 0.1f)
                                                    else Color(0xFFE53935).copy(alpha = 0.1f),
                                                    RoundedCornerShape(12.dp)
                                                ),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                Icons.Filled.Repeat,
                                                contentDescription = null,
                                                tint = if (transaction.type == "income") Color(0xFF43A047) else Color(0xFFE53935)
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Text(
                                                text = transaction.name,
                                                fontSize = 16.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = Color(0xFF1A202C)
                                            )
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = "${transaction.recurringType} · ${transaction.account}",
                                                fontSize = 12.sp,
                                                color = Color(0xFF718096)
                                            )
                                        }
                                    }
                                    Column(horizontalAlignment = Alignment.End) {
                                        Text(
                                            text = "${if (transaction.type == "income") "+" else "-"}¥${transaction.amount}",
                                            fontSize = 18.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (transaction.type == "income") Color(0xFF43A047) else Color(0xFFE53935)
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = transaction.category,
                                            fontSize = 12.sp,
                                            color = Color(0xFF718096)
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    AssistChip(
                                        onClick = { },
                                        label = { Text(if (transaction.enabled) "暂停" else "开启") },
                                        colors = AssistChipDefaults.assistChipColors(
                                            containerColor = if (transaction.enabled) Color(0xFFF5F5F5) else Color(0xFF43A047).copy(alpha = 0.1f),
                                            labelColor = if (transaction.enabled) Color(0xFF718096) else Color(0xFF43A047)
                                        )
                                    )
                                    AssistChip(
                                        onClick = { },
                                        label = { Text("编辑") },
                                        colors = AssistChipDefaults.assistChipColors(
                                            containerColor = Color(0xFF4A90D9).copy(alpha = 0.1f),
                                            labelColor = Color(0xFF4A90D9)
                                        )
                                    )
                                    AssistChip(
                                        onClick = { recurringTransactions.removeAt(index) },
                                        label = { Text("删除") },
                                        colors = AssistChipDefaults.assistChipColors(
                                            containerColor = Color(0xFFE53935).copy(alpha = 0.1f),
                                            labelColor = Color(0xFFE53935)
                                        )
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}