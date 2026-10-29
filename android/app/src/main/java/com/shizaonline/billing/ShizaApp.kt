package com.shizaonline.billing

import android.app.Application
import com.shizaonline.billing.data.local.AppDatabase

class ShizaApp : Application() {
    val database: AppDatabase by lazy { AppDatabase.getDatabase(this) }

    override fun onCreate() {
        super.onCreate()
    }
}
