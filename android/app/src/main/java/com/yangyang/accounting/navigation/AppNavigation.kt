package com.yangyang.accounting.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.yangyang.accounting.screens.*

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Statistics : Screen("statistics")
    object Accounts : Screen("accounts")
    object Assets : Screen("assets")
    object Profile : Screen("profile")
    object AddTransaction : Screen("add_transaction")
    object Calendar : Screen("calendar")
    object Budget : Screen("budget")
    object Wishlist : Screen("wishlist")
    object Recurring : Screen("recurring")
    object AccountManagement : Screen("account_management")
    object TagManagement : Screen("tag_management")
    object CategoryManagement : Screen("category_management")
    object LedgerManagement : Screen("ledger_management")
    object Settings : Screen("settings")
    object ThemeSettings : Screen("theme_settings")
    object IconManagement : Screen("icon_management")
    object DataMode : Screen("data_mode")
    object CloudSync : Screen("cloud_sync")
    object RemoteDatabase : Screen("remote_database")
    object ImportExport : Screen("import_export")
    object DataBackup : Screen("data_backup")
}

@Composable
fun AppNavigation(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = Screen.Home.route) {
        composable(Screen.Home.route) {
            HomeScreen(navController = navController)
        }
        composable(Screen.Statistics.route) {
            StatisticsScreen(navController = navController)
        }
        composable(Screen.Accounts.route) {
            AccountsScreen(navController = navController)
        }
        composable(Screen.Assets.route) {
            AssetsScreen(navController = navController)
        }
        composable(Screen.Profile.route) {
            ProfileScreen(navController = navController)
        }
        composable(Screen.AddTransaction.route) {
            AddTransactionScreen(navController = navController)
        }
        composable(Screen.Calendar.route) {
            CalendarScreen(navController = navController)
        }
        composable(Screen.Budget.route) {
            BudgetScreen(navController = navController)
        }
        composable(Screen.Wishlist.route) {
            WishlistScreen(navController = navController)
        }
        composable(Screen.Recurring.route) {
            RecurringScreen(navController = navController)
        }
        composable(Screen.AccountManagement.route) {
            AccountManagementScreen(navController = navController)
        }
        composable(Screen.TagManagement.route) {
            TagManagementScreen(navController = navController)
        }
        composable(Screen.CategoryManagement.route) {
            CategoryManagementScreen(navController = navController)
        }
        composable(Screen.LedgerManagement.route) {
            LedgerManagementScreen(navController = navController)
        }
        composable(Screen.Settings.route) {
            SettingsScreen(navController = navController)
        }
        composable(Screen.ThemeSettings.route) {
            ThemeSettingsScreen(navController = navController)
        }
        composable(Screen.IconManagement.route) {
            IconManagementScreen(navController = navController)
        }
        composable(Screen.DataMode.route) {
            DataModeScreen(navController = navController)
        }
        composable(Screen.CloudSync.route) {
            CloudSyncScreen(navController = navController)
        }
        composable(Screen.RemoteDatabase.route) {
            RemoteDatabaseScreen(navController = navController)
        }
        composable(Screen.ImportExport.route) {
            ImportExportScreen(navController = navController)
        }
        composable(Screen.DataBackup.route) {
            DataBackupScreen(navController = navController)
        }
    }
}
