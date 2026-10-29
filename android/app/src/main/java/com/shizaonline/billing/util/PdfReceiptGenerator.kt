package com.shizaonline.billing.util

import android.content.Context
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream

object PdfReceiptGenerator {
    /**
     * Generates a native Android PDF receipt using Android's native PdfDocument API
     */
    fun generateInvoicePdf(
        context: Context,
        invoiceNumber: String,
        customerName: String,
        customerMobile: String?,
        totalRupees: Double,
        paidRupees: Double,
        balanceRupees: Double,
        destFile: File
    ): File {
        val document = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // Standard A4 points
        val page = document.startPage(pageInfo)
        val canvas: Canvas = page.canvas

        val titlePaint = Paint().apply {
            color = Color.parseColor("#0F172A")
            textSize = 20f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            textAlign = Paint.Align.CENTER
        }

        val textPaint = Paint().apply {
            color = Color.DKGRAY
            textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        }

        val boldPaint = Paint().apply {
            color = Color.BLACK
            textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }

        // Draw Header
        val centerX = 595f / 2f
        canvas.drawText("SHIZA ONLINE — সিজা অনলাইন", centerX, 60f, titlePaint)

        titlePaint.textSize = 13f
        titlePaint.color = Color.parseColor("#1E3A8A")
        canvas.drawText("CSC | Digital Service Centre", centerX, 80f, titlePaint)

        val subPaint = Paint().apply {
            color = Color.GRAY
            textSize = 10f
            textAlign = Paint.Align.CENTER
        }
        canvas.drawText("বেলকুড়িয়া, জোড়দিঘী, দক্ষিণ দিনাজপুর, ৭৩৩১২১", centerX, 100f, subPaint)
        canvas.drawText("যোগাযোগ: 6294363894", centerX, 115f, subPaint)

        // Line divider
        canvas.drawLine(50f, 130f, 545f, 130f, boldPaint)

        // Invoice Details
        canvas.drawText("বিল নম্বর: $invoiceNumber", 50f, 160f, boldPaint)
        canvas.drawText("গ্রাহক: $customerName", 50f, 185f, boldPaint)
        customerMobile?.let {
            canvas.drawText("মোবাইল: +91 $it", 50f, 210f, textPaint)
        }

        // Financials
        canvas.drawLine(50f, 230f, 545f, 230f, textPaint)
        canvas.drawText("সর্বমোট প্রদেয়: ₹%.2f".format(totalRupees), 50f, 260f, boldPaint)
        canvas.drawText("পরিশোধিত টাকা: ₹%.2f".format(paidRupees), 50f, 285f, textPaint)
        canvas.drawText("অবশিষ্ট বাকি: ₹%.2f".format(balanceRupees), 50f, 310f, boldPaint)

        // Footer Motto
        canvas.drawLine(50f, 350f, 545f, 350f, textPaint)
        canvas.drawText("“আপনার অনলাইন কাজের সহজ সমাধান।”", centerX, 380f, subPaint)

        document.finishPage(page)
        FileOutputStream(destFile).use { out ->
            document.writeTo(out)
        }
        document.close()

        return destFile
    }

    /**
     * Shares the generated PDF through Android Sharesheet / WhatsApp
     */
    fun shareReceiptFile(context: Context, pdfFile: File) {
        val uri = FileProvider.getUriForFile(
            context,
            "\${context.packageName}.provider",
            pdfFile
        )
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "application/pdf"
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(shareIntent, "রশিদ শেয়ার করুন (Share Receipt)"))
    }
}
