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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.yangyang.accounting.data.Ledger
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LedgerManagementScreen(navController: NavHostController) {
    val ledgers = remember {
        mutableStateListOf<Ledger>(
            Ledger("1", "个人账本", "📚", "#4A90D9", Date().toString())
        )
    }
    var showAddDialog by remember { mutableStateOf(false) }
    var newLedgerName by remember { mutableStateOf("") }

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
                        text = "账本管理",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A202C),
                        modifier = Modifier.weight(1f),
                        textAlign = TextAlign.Center
                    )
                    IconButton(onClick = { showAddDialog = true }) {
                        Icon(Icons.Filled.Add, contentDescription = "添加", tint = Color(0xFF4A90D9))
                    }
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF0F5FA))
                .padding(padding)
        ) {
            LazyColumn(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(ledgers.size) { index ->
                    val ledger = ledgers[index]
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(Color.White)
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
                                        .background(Color(0xFF4A90D9).copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(ledger.icon ?: "📚", fontSize = 20.sp)
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = ledger.name,
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Color(0xFF1A202C)
                                    )
                                    Text(
                                        text = if (index == 0) "默认账本" else "账本",
                                        fontSize = 12.sp,
                                        color = Color(0xFF718096)
                                    )
                                }
                            }
                            IconButton(onClick = {
                                if (index != 0) {
                                    ledgers.removeAt(index)
                                }
                            }) {
                                Icon(
                                    Icons.Filled.Delete,
                                    contentDescription = "删除",
                                    tint = if (index == 0) Color(0xFFCBD5E0) else Color(0xFFE53935)
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("新建账本") },
            text = {
                OutlinedTextField(
                    value = newLedgerName,
                    onValueChange = { newLedgerName = it },
                    label = { Text("账本名称") },
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(onClick = {
                    if (newLedgerName.isNotBlank()) {
                        ledgers.add(
                            Ledger(
                                UUID.randomUUID().toString(),
                                newLedgerName,
                                "📚",
                                "#4A90D9",
                                Date().toString()
                            )
                        )
                        newLedgerName = ""
                        showAddDialog = false
                    }
                }) {
                    Text("创建")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) {
                    Text("取消")
                }
            }
        )
    }
}