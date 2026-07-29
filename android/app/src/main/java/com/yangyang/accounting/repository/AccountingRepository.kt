package com.yangyang.accounting.repository

import com.yangyang.accounting.AccountingApp
import com.yangyang.accounting.data.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class TransactionRepository {
    private val dao = AccountingApp.database.transactionDao()

    suspend fun getByLedger(ledgerId: String): List<Transaction> {
        return withContext(Dispatchers.IO) {
            dao.getByLedger(ledgerId)
        }
    }

    suspend fun getByDate(date: String, ledgerId: String): List<Transaction> {
        return withContext(Dispatchers.IO) {
            dao.getByDate(date, ledgerId)
        }
    }

    suspend fun getByMonth(year: Int, month: Int, ledgerId: String): List<Transaction> {
        val prefix = "${year}-${String.format("%02d", month)}"
        return withContext(Dispatchers.IO) {
            dao.getByMonth(prefix, ledgerId)
        }
    }

    suspend fun getByRange(startDate: String, endDate: String, ledgerId: String): List<Transaction> {
        return withContext(Dispatchers.IO) {
            dao.getByRange(startDate, endDate, ledgerId)
        }
    }

    suspend fun getById(id: String): Transaction? {
        return withContext(Dispatchers.IO) {
            dao.getById(id)
        }
    }

    suspend fun insert(transaction: Transaction) {
        withContext(Dispatchers.IO) {
            dao.insert(transaction)
        }
    }

    suspend fun update(transaction: Transaction) {
        withContext(Dispatchers.IO) {
            dao.update(transaction)
        }
    }

    suspend fun delete(transaction: Transaction) {
        withContext(Dispatchers.IO) {
            dao.delete(transaction)
        }
    }

    suspend fun deleteByIds(ids: List<String>) {
        withContext(Dispatchers.IO) {
            dao.deleteByIds(ids)
        }
    }

    suspend fun getMonthlySummary(year: Int, month: Int, ledgerId: String): Summary {
        val transactions = getByMonth(year, month, ledgerId)
        val income = transactions.filter { it.type == "income" }.sumOf { it.amount }
        val expense = transactions.filter { it.type == "expense" }.sumOf { it.amount }
        return Summary(income, expense, income - expense)
    }

    suspend fun getDailyData(year: Int, month: Int, ledgerId: String): List<DailyData> {
        val transactions = getByMonth(year, month, ledgerId)
        val days = java.time.YearMonth.of(year, month).lengthOfMonth()
        val result = mutableListOf<DailyData>()
        for (day in 1..days) {
            val date = "${year}-${String.format("%02d", month)}-${String.format("%02d", day)}"
            val dayTransactions = transactions.filter { it.date == date }
            val expense = dayTransactions.filter { it.type == "expense" }.sumOf { it.amount }
            result.add(DailyData(date, day.toString(), expense))
        }
        return result
    }

    suspend fun getCategoryStats(year: Int, month: Int, type: String, ledgerId: String): List<CategoryStat> {
        val transactions = getByMonth(year, month, ledgerId).filter { it.type == type }
        val total = transactions.sumOf { it.amount }
        val map = mutableMapOf<String, Pair<Double, Int>>()
        transactions.forEach { t ->
            val current = map.getOrDefault(t.category, Pair(0.0, 0))
            map[t.category] = Pair(current.first + t.amount, current.second + 1)
        }
        return map.entries.map { (name, data) ->
            CategoryStat(name, data.first, data.second, if (total > 0) (data.first / total * 100) else 0.0)
        }.sortedByDescending { it.amount }
    }

    data class Summary(val income: Double, val expense: Double, val balance: Double)
    data class DailyData(val date: String, val day: String, val amount: Double)
    data class CategoryStat(val name: String, val amount: Double, val count: Int, val percentage: Double)
}

class LedgerRepository {
    private val dao = AccountingApp.database.ledgerDao()

    suspend fun getAll(): List<Ledger> {
        return withContext(Dispatchers.IO) {
            dao.getAll()
        }
    }

    suspend fun getById(id: String): Ledger? {
        return withContext(Dispatchers.IO) {
            dao.getById(id)
        }
    }

    suspend fun insert(ledger: Ledger) {
        withContext(Dispatchers.IO) {
            dao.insert(ledger)
        }
    }

    suspend fun update(ledger: Ledger) {
        withContext(Dispatchers.IO) {
            dao.update(ledger)
        }
    }

    suspend fun delete(ledger: Ledger) {
        withContext(Dispatchers.IO) {
            dao.delete(ledger)
        }
    }
}

class AccountRepository {
    private val dao = AccountingApp.database.accountDao()

    suspend fun getAll(): List<Account> {
        return withContext(Dispatchers.IO) {
            dao.getAll()
        }
    }

    suspend fun getById(id: String): Account? {
        return withContext(Dispatchers.IO) {
            dao.getById(id)
        }
    }

    suspend fun insert(account: Account) {
        withContext(Dispatchers.IO) {
            dao.insert(account)
        }
    }

    suspend fun update(account: Account) {
        withContext(Dispatchers.IO) {
            dao.update(account)
        }
    }

    suspend fun delete(account: Account) {
        withContext(Dispatchers.IO) {
            dao.delete(account)
        }
    }

    suspend fun getTotalAssets(): Double {
        val accounts = getAll()
        return accounts.filter { it.type in listOf("fund", "recharge", "investment") }.sumOf { it.balance }
    }

    suspend fun getTotalLiabilities(): Double {
        val accounts = getAll()
        return accounts.filter { it.type == "credit" }.sumOf { it.balance }
    }

    suspend fun getNetWorth(): Double {
        return getTotalAssets() - getTotalLiabilities()
    }
}

class AssetRepository {
    private val dao = AccountingApp.database.assetDao()

    suspend fun getAll(): List<Asset> {
        return withContext(Dispatchers.IO) {
            dao.getAll()
        }
    }

    suspend fun getByCategory(category: String): List<Asset> {
        return withContext(Dispatchers.IO) {
            dao.getByCategory(category)
        }
    }

    suspend fun getById(id: String): Asset? {
        return withContext(Dispatchers.IO) {
            dao.getById(id)
        }
    }

    suspend fun insert(asset: Asset) {
        withContext(Dispatchers.IO) {
            dao.insert(asset)
        }
    }

    suspend fun update(asset: Asset) {
        withContext(Dispatchers.IO) {
            dao.update(asset)
        }
    }

    suspend fun delete(asset: Asset) {
        withContext(Dispatchers.IO) {
            dao.delete(asset)
        }
    }

    suspend fun deleteByIds(ids: List<String>) {
        withContext(Dispatchers.IO) {
            dao.deleteByIds(ids)
        }
    }

    suspend fun getTotalValue(): Double {
        return getAll().sumOf { it.price }
    }

    suspend fun getTotalDailyCost(): Double {
        return getAll().filter { it.status == "active" }.sumOf { it.dailyCost }
    }

    suspend fun getCategoryBreakdown(): List<CategoryBreakdown> {
        val assets = getAll()
        val map = mutableMapOf<String, Pair<Double, Int>>()
        assets.forEach { a ->
            val current = map.getOrDefault(a.category, Pair(0.0, 0))
            map[a.category] = Pair(current.first + a.price, current.second + 1)
        }
        return map.entries.map { (name, data) ->
            CategoryBreakdown(name, data.first, data.second)
        }
    }

    data class CategoryBreakdown(val name: String, val value: Double, val count: Int)
}

class BudgetRepository {
    private val dao = AccountingApp.database.budgetDao()

    suspend fun get(): Budget {
        return withContext(Dispatchers.IO) {
            dao.get() ?: Budget("default", 5000.0, 60000.0)
        }
    }

    suspend fun update(budget: Budget) {
        withContext(Dispatchers.IO) {
            val existing = dao.get()
            if (existing != null) {
                dao.update(budget)
            } else {
                dao.insert(budget)
            }
        }
    }
}

class RecurringRepository {
    private val dao = AccountingApp.database.recurringTransactionDao()

    suspend fun getAll(): List<RecurringTransaction> {
        return withContext(Dispatchers.IO) {
            dao.getAll()
        }
    }

    suspend fun getById(id: String): RecurringTransaction? {
        return withContext(Dispatchers.IO) {
            dao.getById(id)
        }
    }

    suspend fun insert(transaction: RecurringTransaction) {
        withContext(Dispatchers.IO) {
            dao.insert(transaction)
        }
    }

    suspend fun update(transaction: RecurringTransaction) {
        withContext(Dispatchers.IO) {
            dao.update(transaction)
        }
    }

    suspend fun delete(transaction: RecurringTransaction) {
        withContext(Dispatchers.IO) {
            dao.delete(transaction)
        }
    }
}
