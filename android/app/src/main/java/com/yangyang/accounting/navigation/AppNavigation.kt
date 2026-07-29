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
    }
}
