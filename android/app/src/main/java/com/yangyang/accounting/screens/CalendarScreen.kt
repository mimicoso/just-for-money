package com.yangyang.accounting.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import java.util.*
import androidx.lifecycle.viewmodel.compose.viewModel
import com.yangyang.accounting.viewmodel.MainViewModel

@Composable
fun CalendarScreen(navController: NavHostController) {
    val viewModel: MainViewModel = viewModel()
    val transactions by viewModel.transactions.collectAsState()
    val activeLedgerId by viewModel.activeLedgerId.collectAsState()

    val calendar = Calendar.getInstance()
    var currentYear by remember { mutableStateOf(calendar.get(Calendar.YEAR)) }
    var currentMonth by remember { mutableStateOf(calendar.get(Calendar.MONTH) + 1) }
    var selectedDate by remember { mutableStateOf(calendar.get(Calendar.DAY_OF_MONTH)) }

    calendar.set(Calendar.YEAR, currentYear)
    calendar.set(Calendar.MONTH, currentMonth - 1)
    val daysInMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH)

    val weekDays = listOf("日", "一", "二", "三", "四", "五", "六")

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
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = {
                        if (currentMonth == 1) {
                            currentYear--
                            currentMonth = 12
                        } else {
                            currentMonth--
                        }
                    }) {
                        Icon(Icons.Filled.ChevronLeft, contentDescription = "上个月", tint = Color(0xFF718096))
                    }
                    Text(
                        text = "${currentYear}年${currentMonth}月",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A202C)
                    )
                    IconButton(onClick = {
                        if (currentMonth == 12) {
                            currentYear++
                            currentMonth = 1
                        } else {
                            currentMonth++
                        }
                    }) {
                        Icon(Icons.Filled.ChevronRight, contentDescription = "下个月", tint = Color(0xFF718096))
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
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(modifier = Modifier.fillMaxWidth()) {
                        weekDays.forEach { day ->
                            Text(
                                text = day,
                                fontSize = 12.sp,
                                color = Color(0xFFA0AEC0),
                                textAlign = TextAlign.Center,
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))

                    LazyVerticalGrid(
                        columns = GridCells.Fixed(7),
                        modifier = Modifier.height(300.dp)
                    ) {
                        items((1..daysInMonth).toList()) { day ->
                            val isSelected = day == selectedDate
                            val isToday = day == calendar.get(Calendar.DAY_OF_MONTH) &&
                                    currentMonth == calendar.get(Calendar.MONTH) + 1 &&
                                    currentYear == calendar.get(Calendar.YEAR)

                            Box(
                                modifier = Modifier
                                    .padding(4.dp)
                                    .size(40.dp)
                                    .background(
                                        if (isSelected) Color(0xFF4A90D9)
                                        else if (isToday) Color(0xFF4A90D9).copy(alpha = 0.1f)
                                        else Color.Transparent,
                                        shape = RoundedCornerShape(20.dp)
                                    )
                                    .clickable { selectedDate = day },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = day.toString(),
                                    fontSize = 14.sp,
                                    color = if (isSelected) Color.White
                                    else if (isToday) Color(0xFF4A90D9)
                                    else Color(0xFF1A202C)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "${currentMonth}月${selectedDate}日",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF1A202C),
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            LazyColumn(modifier = Modifier.padding(16.dp)) {
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(Color.White)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                Icons.Filled.CalendarMonth,
                                contentDescription = null,
                                tint = Color(0xFFCBD5E0),
                                modifier = Modifier.size(48.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "当天暂无账单",
                                fontSize = 14.sp,
                                color = Color(0xFF718096)
                            )
                        }
                    }
                }
            }
        }
    }
}