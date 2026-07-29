package com.yangyang.accounting.data

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [
        Ledger::class,
        Transaction::class,
        Account::class,
        AccountGroup::class,
        Asset::class,
        AssetGroup::class,
        Budget::class,
        CategoryBudget::class,
        RecurringTransaction::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun ledgerDao(): LedgerDao
    abstract fun transactionDao(): TransactionDao
    abstract fun accountDao(): AccountDao
    abstract fun accountGroupDao(): AccountGroupDao
    abstract fun assetDao(): AssetDao
    abstract fun assetGroupDao(): AssetGroupDao
    abstract fun budgetDao(): BudgetDao
    abstract fun categoryBudgetDao(): CategoryBudgetDao
    abstract fun recurringTransactionDao(): RecurringTransactionDao
}
