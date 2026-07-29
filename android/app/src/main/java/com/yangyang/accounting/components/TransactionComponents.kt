package com.yangyang.accounting.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.yangyang.accounting.data.Transaction
import com.yangyang.accounting.repository.TransactionRepository

@Composable
fun SummaryCard(summary: TransactionRepository.Summary, budget: Double) {
    val budgetProgress = if (budget > 0) (summary.expense / budget * 100).coerceAtMost(100.0) else 0.0
    val remaining = (budget - summary.expense).coerceAtLeast(0.0)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(Color(0xFF5B9BD5))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "本月收入", fontSize = 12.sp, color = Color.White.copy(0.9f), modifier = Modifier.padding(bottom = 4.dp))
                    Text(text = "¥${formatCurrency(summary.income)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
                Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "本月支出", fontSize = 12.sp, color = Color.White.copy(0.9f), modifier = Modifier.padding(bottom = 4.dp))
                    Text(text = "¥${formatCurrency(summary.expense)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
                Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "本月结余", fontSize = 12.sp, color = Color.White.copy(0.9f), modifier = Modifier.padding(bottom = 4.dp))
                    Text(text = "¥${formatCurrency(summary.balance)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(text = "总资产(元)", fontSize = 12.sp, color = Color.White.copy(0.9f), modifier = Modifier.padding(bottom = 4.dp))
            Text(text = "¥${formatCurrency(summary.balance)}", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)

            Spacer(modifier = Modifier.height(12.dp))

            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                color = Color.White.copy(0.1f)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = "月度预算", fontSize = 12.sp, color = Color.White.copy(0.9f))
                        Text(text = "¥${formatCurrency(summary.expense)} / ¥${formatCurrency(budget)}", fontSize = 12.sp, color = Color.White.copy(0.9f))
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { budgetProgress.toFloat() / 100 },
                        modifier = Modifier.height(6.dp),
                        color = Color.White,
                        trackColor = Color.White.copy(0.2f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (budgetProgress > 100) "已超支" else "剩余¥${formatCurrency(remaining)}",
                        fontSize = 10.sp,
                        color = Color.White.copy(0.7f),
                        textAlign = TextAlign.End,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}

@Composable
fun TransactionItem(transaction: Transaction, onClick: () -> Unit, onLongClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .clickable(onClick = onClick)
            .pointerInput(Unit) {
                detectTapGestures(
                    onLongPress = { onLongClick() }
                )
            },
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(modifier = Modifier.padding(12.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = transaction.category, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF1A202C))
                if (transaction.note.isNotEmpty()) {
                    Text(text = transaction.note, fontSize = 12.sp, color = Color(0xFF718096))
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = if (transaction.type == "income") "+¥${formatCurrency(transaction.amount)}" else "-¥${formatCurrency(transaction.amount)}",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (transaction.type == "income") Color(0xFFE53935) else Color(0xFF43A047)
                )
                Text(text = transaction.date, fontSize = 12.sp, color = Color(0xFFA0AEC0))
            }
        }
    }
}

fun formatCurrency(value: Double): String {
    return "%.2f".format(value)
}
