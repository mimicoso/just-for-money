package com.yangyang.accounting.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.yangyang.accounting.data.Ledger
import com.yangyang.accounting.data.MockData
import com.yangyang.accounting.data.Transaction
import com.yangyang.accounting.repository.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate

class MainViewModel : ViewModel() {
    private val transactionRepo = TransactionRepository()
    private val ledgerRepo = LedgerRepository()
    private val accountRepo = AccountRepository()
    private val assetRepo = AssetRepository()
    private val budgetRepo = BudgetRepository()

    private val _activeLedgerId = MutableStateFlow("default")
    val activeLedgerId: StateFlow<String> = _activeLedgerId.asStateFlow()

    private val _ledgers = MutableStateFlow<List<Ledger>>(emptyList())
    val ledgers: StateFlow<List<Ledger>> = _ledgers.asStateFlow()

    private val _transactions = MutableStateFlow<List<Transaction>>(emptyList())
    val transactions: StateFlow<List<Transaction>> = _transactions.asStateFlow()

    private val _monthlySummary = MutableStateFlow(TransactionRepository.Summary(0.0, 0.0, 0.0))
    val monthlySummary: StateFlow<TransactionRepository.Summary> = _monthlySummary.asStateFlow()

    private val _budget = MutableStateFlow(com.yangyang.accounting.data.Budget("default", 5000.0, 60000.0))
    val budget = _budget.asStateFlow()

    init {
        viewModelScope.launch {
            initData()
            loadData()
        }
    }

    private suspend fun initData() {
        val ledgers = ledgerRepo.getAll()
        if (ledgers.isEmpty()) {
            ledgerRepo.insert(MockData.getDefaultLedger())
        }

        val transactions = transactionRepo.getByLedger("default")
        if (transactions.isEmpty()) {
            MockData.getMockTransactions().forEach { transactionRepo.insert(it) }
        }

        val accounts = accountRepo.getAll()
        if (accounts.isEmpty()) {
            MockData.getMockAccounts().forEach { accountRepo.insert(it) }
        }

        val assets = assetRepo.getAll()
        if (assets.isEmpty()) {
            MockData.getMockAssets().forEach { assetRepo.insert(it) }
        }
    }

    private fun loadData() {
        viewModelScope.launch {
            _ledgers.value = ledgerRepo.getAll()
            loadTransactions()
            loadBudget()
        }
    }

    private fun loadTransactions() {
        viewModelScope.launch {
            _transactions.value = transactionRepo.getByLedger(_activeLedgerId.value)
            val now = LocalDate.now()
            _monthlySummary.value = transactionRepo.getMonthlySummary(now.year, now.monthValue, _activeLedgerId.value)
        }
    }

    private fun loadBudget() {
        viewModelScope.launch {
            _budget.value = budgetRepo.get()
        }
    }

    fun setActiveLedger(id: String) {
        _activeLedgerId.value = id
        loadTransactions()
    }

    fun addLedger(name: String) {
        viewModelScope.launch {
            val ledger = Ledger(
                id = System.currentTimeMillis().toString(),
                name = name,
                icon = "BookOpen",
                color = "#4A90D9",
                createdAt = LocalDate.now().toString()
            )
            ledgerRepo.insert(ledger)
            _ledgers.value = ledgerRepo.getAll()
        }
    }

    fun addTransaction(transaction: Transaction) {
        viewModelScope.launch {
            transactionRepo.insert(transaction)
            loadTransactions()
        }
    }

    fun updateTransaction(transaction: Transaction) {
        viewModelScope.launch {
            transactionRepo.update(transaction)
            loadTransactions()
        }
    }

    fun deleteTransaction(id: String) {
        viewModelScope.launch {
            val transaction = transactionRepo.getById(id)
            transaction?.let {
                transactionRepo.delete(it)
                loadTransactions()
            }
        }
    }

    fun deleteTransactions(ids: List<String>) {
        viewModelScope.launch {
            transactionRepo.deleteByIds(ids)
            loadTransactions()
        }
    }
}
