package com.yangyang.accounting.data

import android.content.Context

class MockData {
    companion object {
        fun getMockTransactions(): List<Transaction> {
            return listOf(
                Transaction("1", "default", "income", 327.69, "收入", "理财盈利", "家庭小荷包", "2026-06-26", "家庭小荷包 账户余额补齐"),
                Transaction("2", "default", "income", 255.60, "收入", "理财盈利", "网商银行", "2026-06-26", "网商银行 账户余额补齐"),
                Transaction("3", "default", "expense", 2.85, "交通开支", "公共交通", "深圳通", "2026-06-21", ""),
                Transaction("4", "default", "expense", 3.80, "交通开支", "公共交通", "深圳通", "2026-06-21", ""),
                Transaction("5", "default", "income", 0.40, "收入", "其他", "蚂蚁花呗", "2026-06-21", "蚂蚁花呗账户余额补齐"),
                Transaction("6", "default", "income", 50.00, "收入", "其他", "招商银行9345", "2026-06-21", "招商银行9345账户余额补齐"),
                Transaction("7", "default", "income", 0.78, "理财盈利", "理财收入", "招商银行9345", "2026-06-21", ""),
                Transaction("8", "default", "expense", 115.00, "吃吃喝喝", "咖啡饮料", "招商银行9345", "2026-06-21", "深圳光明椿屋咖啡"),
                Transaction("9", "default", "expense", 180.00, "吃吃喝喝", "一日三餐", "建设银行信用卡", "2026-06-21", ""),
                Transaction("10", "default", "expense", 4507.95, "房租水电", "房租", "招商银行9345", "2026-06-11", ""),
                Transaction("11", "default", "expense", 2536.38, "吃吃喝喝", "一日三餐", "招商银行9345", "2026-06-13", ""),
                Transaction("12", "default", "expense", 455.00, "交通开支", "公共交通", "深圳通", "2026-06-13", ""),
                Transaction("13", "default", "expense", 860.00, "花草宠物", "宠物用品", "招商银行9345", "2026-06-09", ""),
                Transaction("14", "default", "expense", 220.00, "旅游开支", "景点门票", "招商银行9345", "2026-06-07", ""),
                Transaction("15", "default", "expense", 36.00, "个人喜好", "书籍", "招商银行9345", "2026-06-05", ""),
                Transaction("16", "default", "expense", 35.00, "娱乐运动", "运动健身", "招商银行9345", "2026-06-03", ""),
                Transaction("17", "default", "expense", 22.50, "生活支出", "日用品", "招商银行9345", "2026-06-01", "")
            )
        }

        fun getMockAccounts(): List<Account> {
            return listOf(
                Account("1", "招商银行9345", "fund", 2164.29, null),
                Account("2", "网商银行", "fund", 0.0, null),
                Account("3", "家庭小荷包", "fund", 0.0, null),
                Account("4", "深圳通", "recharge", 0.0, null),
                Account("5", "蚂蚁花呗", "credit", 0.0, null),
                Account("6", "建设银行信用卡", "credit", 0.0, null)
            )
        }

        fun getMockAssets(): List<Asset> {
            return listOf(
                Asset("1", "笔记本电脑", "电子产品", 5450.0, "2017-10-24", null, 1.71, "active"),
                Asset("2", "燕飞利仕震荡波", "电子产品", 75.0, "2026-06-21", null, 8.33, "active"),
                Asset("3", "神牛 IT32 闪光灯", "电子产品", 370.0, "2026-03-30", null, 3.63, "active"),
                Asset("4", "松下85mm F1.8", "电子产品", 2619.90, "2023-06-17", null, 3.59, "active"),
                Asset("5", "松下s5-2060套机", "电子产品", 8767.22, "2023-06-17", null, 11.64, "active"),
                Asset("6", "燕飞利仕震荡波", "电子产品", 89.0, "2023-08-22", null, 0.08, "active"),
                Asset("7", "显示器", "电子产品", 100.0, "2025-05-21", null, 0.24, "active"),
                Asset("8", "一加 Ace Pro", "电子产品", 2650.0, "2023-01-08", null, 2.12, "active"),
                Asset("9", "OPPO Find X8 Ultra", "电子产品", 6029.05, "2025-06-16", null, 15.50, "active"),
                Asset("10", "OPPO watch 4 Pro", "电子产品", 1625.0, "2024-03-29", null, 1.95, "active")
            )
        }

        fun getMockAccountGroups(): List<AccountGroup> {
            return listOf(
                AccountGroup("g1", "资金账户", null),
                AccountGroup("g2", "信用卡", null),
                AccountGroup("g3", "投资", null),
                AccountGroup("g4", "储蓄", null)
            )
        }

        fun getMockAssetGroups(): List<AssetGroup> {
            return listOf(
                AssetGroup("ag1", "电子产品"),
                AssetGroup("ag2", "虚拟物品"),
                AssetGroup("ag3", "其他")
            )
        }

        fun getMockRecurringTransactions(): List<RecurringTransaction> {
            return listOf(
                RecurringTransaction("1", "工资收入", 15000.0, "income", "工资", "工资卡", "monthly", null, 10, "2026-01-01", null, null, true),
                RecurringTransaction("2", "房租", 3500.0, "expense", "居住", "银行卡", "monthly", null, 1, "2026-01-01", null, null, true),
                RecurringTransaction("3", "餐饮补贴", 2000.0, "income", "奖金补贴", "工资卡", "monthly", null, 20, "2026-01-01", null, null, false),
                RecurringTransaction("4", "健身会员", 299.0, "expense", "娱乐", "微信支付", "monthly", null, 15, "2026-01-01", null, null, true)
            )
        }

        fun getDefaultLedger(): Ledger {
            return Ledger("default", "个人账本", "BookOpen", "#4A90D9", java.time.LocalDate.now().toString())
        }

        fun getDefaultBudget(): Budget {
            return Budget("default", 5000.0, 60000.0)
        }
    }
}
