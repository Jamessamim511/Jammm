package com.shizaonline.billing.util

import android.graphics.Bitmap
import android.graphics.Color
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter
import java.net.URLEncoder

object UpiQrHelper {
    /**
     * Builds standard NPCI UPI Payment URI
     */
    fun buildUpiUri(
        upiId: String,
        payeeName: String,
        amountRupees: Double? = null,
        invoiceNumber: String? = null,
        note: String? = null
    ): String {
        val encPn = URLEncoder.encode(payeeName.trim(), "UTF-8")
        var uri = "upi://pay?pa=\${upiId.trim()}&pn=\$encPn&cu=INR"

        amountRupees?.let {
            if (it > 0) uri += "&am=%.2f".format(it)
        }
        invoiceNumber?.let {
            val tr = it.replace(Regex("[^a-zA-Z0-9_-]"), "")
            uri += "&tr=\${URLEncoder.encode(tr, "UTF-8")}"
        }
        val noteText = note ?: if (invoiceNumber != null) "Bill \$invoiceNumber Shiza Online" else "Payment"
        uri += "&tn=\${URLEncoder.encode(noteText, "UTF-8")}"
        return uri
    }

    /**
     * Generates a high-contrast Android Bitmap QR Code using ZXing
     */
    fun generateQrBitmap(content: String, sizePx: Int = 512): Bitmap {
        val writer = QRCodeWriter()
        val bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, sizePx, sizePx)
        val bitmap = Bitmap.createBitmap(sizePx, sizePx, Bitmap.Config.RGB_565)
        for (x in 0 until sizePx) {
            for (y in 0 until sizePx) {
                bitmap.setPixel(x, y, if (bitMatrix[x, y]) Color.BLACK else Color.WHITE)
            }
        }
        return bitmap
    }
}
