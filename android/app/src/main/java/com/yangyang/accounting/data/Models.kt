package com.yangyang.accounting.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "ledgers")
data class Ledger(
    @PrimaryKey val id: String,
    val name: String,
    val icon: String?,
    val color: String?,
    val createdAt: String
)

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey val id: String,
    val ledgerId: String,
    val type: String,
    val amount: Double,
    val category: String,
    val subcategory: String,
    val account: String,
    val date: String,
    val note: String
)

@Entity(tableName = "accounts")
data class Account(
    @PrimaryKey val id: String,
    val name: String,
    val type: String,
    val balance: Double,
    val groupId: String?
)

@Entity(tableName = "account_groups")
data class AccountGroup(
    @PrimaryKey val id: String,
    val name: String,
    val icon: String?
)

@Entity(tableName = "assets")
data class Asset(
    @PrimaryKey val id: String,
    val name: String,
    val category: String,
    val price: Double,
    val purchaseDate: String,
    val expiryDate: String?,
    val dailyCost: Double,
    val status: String
)

@Entity(tableName = "asset_groups")
data class AssetGroup(
    @PrimaryKey val id: String,
    val name: String
)

@Entity(tableName = "budgets")
data class Budget(
    @PrimaryKey val id: String,
    val monthlyBudget: Double,
    val yearlyBudget: Double
)

@Entity(tableName = "category_budgets")
data class CategoryBudget(
    @PrimaryKey val id: String,
    val category: String,
    val amount: Double,
    val budgetId: String
)

@Entity(tableName = "recurring_transactions")
data class RecurringTransaction(
    @PrimaryKey val id: String,
    val name: String,
    val amount: Double,
    val type: String,
    val category: String,
    val account: String,
    val recurringType: String,
    val dayOfWeek: Int?,
    val dayOfMonth: Int?,
    val startDate: String,
    val endDate: String?,
    val lastExecuteDate: String?,
    val enabled: Boolean
)
