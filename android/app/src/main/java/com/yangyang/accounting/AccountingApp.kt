package com.yangyang.accounting

import android.app.Application
import androidx.room.Room
import com.yangyang.accounting.data.AppDatabase

class AccountingApp : Application() {
    companion object {
        lateinit var database: AppDatabase
    }

    override fun onCreate() {
        super.onCreate()
        database = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java,
            "accounting_db"
        ).build()
    }
}
