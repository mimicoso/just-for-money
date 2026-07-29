package com.yangyang.accounting.data

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Insert
import androidx.room.Update
import androidx.room.Delete

@Dao
interface LedgerDao {
    @Query("SELECT * FROM ledgers ORDER BY createdAt DESC")
    suspend fun getAll(): List<Ledger>

    @Query("SELECT * FROM ledgers WHERE id = :id")
    suspend fun getById(id: String): Ledger?

    @Insert
    suspend fun insert(ledger: Ledger)

    @Update
    suspend fun update(ledger: Ledger)

    @Delete
    suspend fun delete(ledger: Ledger)
}

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions WHERE ledgerId = :ledgerId ORDER BY date DESC")
    suspend fun getByLedger(ledgerId: String): List<Transaction>

    @Query("SELECT * FROM transactions WHERE date = :date AND ledgerId = :ledgerId")
    suspend fun getByDate(date: String, ledgerId: String): List<Transaction>

    @Query("SELECT * FROM transactions WHERE date LIKE :monthPrefix AND ledgerId = :ledgerId")
    suspend fun getByMonth(monthPrefix: String, ledgerId: String): List<Transaction>

    @Query("SELECT * FROM transactions WHERE date BETWEEN :startDate AND :endDate AND ledgerId = :ledgerId")
    suspend fun getByRange(startDate: String, endDate: String, ledgerId: String): List<Transaction>

    @Query("SELECT * FROM transactions WHERE id = :id")
    suspend fun getById(id: String): Transaction?

    @Insert
    suspend fun insert(transaction: Transaction)

    @Update
    suspend fun update(transaction: Transaction)

    @Delete
    suspend fun delete(transaction: Transaction)

    @Query("DELETE FROM transactions WHERE id IN (:ids)")
    suspend fun deleteByIds(ids: List<String>)
}

@Dao
interface AccountDao {
    @Query("SELECT * FROM accounts ORDER BY name")
    suspend fun getAll(): List<Account>

    @Query("SELECT * FROM accounts WHERE id = :id")
    suspend fun getById(id: String): Account?

    @Insert
    suspend fun insert(account: Account)

    @Update
    suspend fun update(account: Account)

    @Delete
    suspend fun delete(account: Account)
}

@Dao
interface AccountGroupDao {
    @Query("SELECT * FROM account_groups ORDER BY name")
    suspend fun getAll(): List<AccountGroup>

    @Insert
    suspend fun insert(group: AccountGroup)

    @Update
    suspend fun update(group: AccountGroup)

    @Delete
    suspend fun delete(group: AccountGroup)
}

@Dao
interface AssetDao {
    @Query("SELECT * FROM assets ORDER BY purchaseDate DESC")
    suspend fun getAll(): List<Asset>

    @Query("SELECT * FROM assets WHERE category = :category")
    suspend fun getByCategory(category: String): List<Asset>

    @Query("SELECT * FROM assets WHERE id = :id")
    suspend fun getById(id: String): Asset?

    @Insert
    suspend fun insert(asset: Asset)

    @Update
    suspend fun update(asset: Asset)

    @Delete
    suspend fun delete(asset: Asset)

    @Query("DELETE FROM assets WHERE id IN (:ids)")
    suspend fun deleteByIds(ids: List<String>)
}

@Dao
interface AssetGroupDao {
    @Query("SELECT * FROM asset_groups ORDER BY name")
    suspend fun getAll(): List<AssetGroup>

    @Insert
    suspend fun insert(group: AssetGroup)

    @Update
    suspend fun update(group: AssetGroup)

    @Delete
    suspend fun delete(group: AssetGroup)
}

@Dao
interface BudgetDao {
    @Query("SELECT * FROM budgets LIMIT 1")
    suspend fun get(): Budget?

    @Insert
    suspend fun insert(budget: Budget)

    @Update
    suspend fun update(budget: Budget)
}

@Dao
interface CategoryBudgetDao {
    @Query("SELECT * FROM category_budgets WHERE budgetId = :budgetId")
    suspend fun getByBudgetId(budgetId: String): List<CategoryBudget>

    @Insert
    suspend fun insert(budget: CategoryBudget)

    @Update
    suspend fun update(budget: CategoryBudget)

    @Delete
    suspend fun delete(budget: CategoryBudget)
}

@Dao
interface RecurringTransactionDao {
    @Query("SELECT * FROM recurring_transactions ORDER BY name")
    suspend fun getAll(): List<RecurringTransaction>

    @Query("SELECT * FROM recurring_transactions WHERE id = :id")
    suspend fun getById(id: String): RecurringTransaction?

    @Insert
    suspend fun insert(transaction: RecurringTransaction)

    @Update
    suspend fun update(transaction: RecurringTransaction)

    @Delete
    suspend fun delete(transaction: RecurringTransaction)
}
