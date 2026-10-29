package com.shizaonline.billing.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "invoices")
data class InvoiceEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val invoiceNumber: String, // e.g. "SO-2026-00001"
    val customerId: String,
    val customerName: String,
    val customerMobile: String?,
    val itemsJson: String,
    val subtotalPaise: Long,
    val discountPaise: Long,
    val totalAmountPaise: Long,
    val paidAmountPaise: Long,
    val balancePaise: Long,
    val paymentMethod: String, // "cash", "upi", "other"
    val paymentStatus: String, // "paid", "partially_paid", "unpaid", "pending_verification", "cancelled"
    val transactionRef: String?,
    val createdByUserId: String,
    val createdByUserName: String,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val syncStatus: String = "pending"
)

@Entity(tableName = "customers")
data class CustomerEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val customerCode: String, // "CUST-1001"
    val name: String,
    val mobile: String?,
    val notes: String?,
    val totalBilledPaise: Long = 0,
    val totalPaidPaise: Long = 0,
    val balancePaise: Long = 0,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "services")
data class ServiceEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val category: String, // "online", "government", "printing", "pvc_card", "recharge_bill", "tickets", "farmer", "other"
    val nameBn: String,
    val nameEn: String,
    val pricePaise: Long,
    val extraChargesPaise: Long = 0,
    val pricingType: String = "fixed", // "fixed", "variable", "unit_based"
    val isFree: Boolean = false,
    val unitBn: String,
    val unitEn: String,
    val active: Boolean = true,
    val imageUrl: String? = null,
    val iconKey: String? = null,
    val descriptionBn: String? = null,
    val descriptionEn: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "business_profile")
data class BusinessProfileEntity(
    @PrimaryKey
    val id: String = "primary_business",
    val name: String = "Shiza Online",
    val bengaliName: String = "সিজা অনলাইন",
    val type: String = "CSC | Digital Service Centre",
    val ownerName: String = "Mominur Islam",
    val address: String = "বেলকুড়িয়া, জোড়দিঘী, দক্ষিণ দিনাজপুর, ৭৩৩১২১",
    val contact: String = "6294363894",
    val whatsapp: String = "6294363894",
    val cscId: String? = "CSC-WB-733121",
    val tagline: String = "আপনার অনলাইন কাজের সহজ সমাধান।",
    val openingHours: String = "সকাল ৮:০০ - রাত ৯:০০ (প্রতিদিন খোলা)",
    val upiId: String = "6294363894@upi",
    val upiMerchantName: String = "Shiza Online",
    val upiNote: String = "Shiza Online Belkuria",
    val logoPath: String? = null,
    val showLogoOnReceipt: Boolean = true,
    val showAddressOnReceipt: Boolean = true,
    val showPhoneOnReceipt: Boolean = true,
    val showOwnerOnReceipt: Boolean = true,
    val showCscIdOnReceipt: Boolean = true,
    val showQrOnReceipt: Boolean = true,
    val invoiceHeaderText: String = "সিজা অনলাইন — ডিজিটাল সেবা ও ক্যাশ মেমো",
    val invoiceFooterText: String = "ধন্যবাদ! আবার আসবেন।",
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "price_history")
data class PriceHistoryEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val serviceId: String,
    val serviceNameBn: String,
    val oldPricePaise: Long,
    val newPricePaise: Long,
    val oldExtraChargesPaise: Long = 0,
    val newExtraChargesPaise: Long = 0,
    val changedByUserId: String,
    val changedByUserName: String,
    val changedAt: Long = System.currentTimeMillis(),
    val reason: String? = null
)

@Entity(tableName = "theme_config")
data class ThemeConfigEntity(
    @PrimaryKey
    val id: String = "primary_theme",
    val preset: String = "professional_blue",
    val colorMode: String = "light",
    val primaryColor: String = "#0f172a",
    val secondaryColor: String = "#1e3a8a",
    val accentColor: String = "#f59e0b",
    val appBgColor: String = "#f8fafc",
    val cardBgColor: String = "#ffffff",
    val textColor: String = "#0f172a",
    val buttonShape: String = "rounded-xl",
    val cardRadius: String = "rounded-2xl",
    val fontSize: String = "base"
)

@Entity(tableName = "payments")
data class PaymentEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val invoiceId: String,
    val invoiceNumber: String,
    val customerId: String,
    val customerName: String,
    val amountPaise: Long,
    val method: String, // "cash", "upi"
    val transactionRef: String?,
    val verificationStatus: String, // "verified", "pending"
    val recordedByUserId: String,
    val recordedByUserName: String,
    val date: Long = System.currentTimeMillis(),
    val notes: String?,
    val syncStatus: String = "pending"
)

@Entity(tableName = "expenses")
data class ExpenseEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val category: String, // "internet", "electricity", "paper_supplies", "maintenance", "other"
    val amountPaise: Long,
    val date: Long = System.currentTimeMillis(),
    val notes: String,
    val createdByUserId: String,
    val createdByUserName: String,
    val syncStatus: String = "pending"
)
