package com.shizaonline.billing

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Automated tests for Shiza Online financial calculations & decimal safety
 */
class InvoiceCalculationTest {

    @Test
    fun testDecimalSafePaiseCalculations() {
        // Test that 5.10 + 10.20 calculates exactly without floating point rounding error
        val price1Paise = 510L  // ₹5.10
        val price2Paise = 1020L // ₹10.20
        val sumPaise = price1Paise + price2Paise
        assertEquals(1530L, sumPaise)
        assertEquals(15.30, sumPaise / 100.0, 0.001)
    }

    @Test
    fun testBalanceCalculation() {
        val totalPaise = 25000L // ₹250.00
        val paidPaise = 15000L  // ₹150.00
        val balancePaise = totalPaise - paidPaise
        assertEquals(10000L, balancePaise) // ₹100.00 balance
    }

    @Test
    fun testInvoiceSequenceNumberFormat() {
        val year = 2026
        val seq = 5
        val formatted = "SO-$year-%05d".format(seq)
        assertEquals("SO-2026-00005", formatted)
    }
}
