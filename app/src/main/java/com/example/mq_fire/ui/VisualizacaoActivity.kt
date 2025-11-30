package com.example.mq_fire.ui

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mq_fire.R
import com.example.mq_fire.data.api.RetrofitInstance
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class VisualizacaoActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.visualizacao)

        val sensorId = intent.getStringExtra("SENSOR_ID")

        if (sensorId == null) {
            Toast.makeText(this, "Erro: Sensor não identificado", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        val txtTituloStatus = findViewById<TextView>(R.id.textView11)
        val txtStatus = findViewById<TextView>(R.id.status)
        val txtNivelFumaca = findViewById<TextView>(R.id.nivelFumaca)
        val txtUltimaLeitura = findViewById<TextView>(R.id.textView13)
        val viewCorStatus = findViewById<View>(R.id.corStatus)

        val btnSensores = findViewById<TextView>(R.id.btnSensores)
        val btnExit = findViewById<ImageView>(R.id.btnExit)
        val icon = findViewById<ImageView>(R.id.icon)

        icon.setOnClickListener {
            startActivity(Intent(this, SensoresActivity::class.java))
            finish()
        }
        btnSensores.setOnClickListener {
            startActivity(Intent(this, SensoresActivity::class.java))
            finish()
        }
        btnExit.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }

        // --- POLLING: ATUALIZAÇÃO AUTOMÁTICA ---
        lifecycleScope.launch {
            while (isActive) {
                try {
                    val sensor = RetrofitInstance.api.getSensorStatus(sensorId)

                    txtTituloStatus.text = "Status da sala ${sensor.nomeSala}"
                    txtNivelFumaca.text = "${sensor.leituraAtual} PPM"
                    
                    // Formatar a data
                    val dataObjeto = parseDate(sensor.dataHora)
                    val dataFormatada = if (dataObjeto != null) {
                        val outputFormat = SimpleDateFormat("dd/MM/yy 'às' HH:mm", Locale.getDefault())
                        outputFormat.format(dataObjeto)
                    } else {
                        "--/--/-- às --:--"
                    }
                    txtUltimaLeitura.text = "Ultimo alerta em: $dataFormatada"

                    // --- LÓGICA DE STATUS E COR ---
                    
                    val cincoMinutosMs = 5 * 60 * 1000
                    val agora = System.currentTimeMillis()
                    
                    val isLeituraAntiga = dataObjeto != null && (agora - dataObjeto.time > cincoMinutosMs)

                    val statusTexto: String
                    val corStatusInt: Int

                    if (isLeituraAntiga) {
                        statusTexto = "Estável"
                        corStatusInt = Color.parseColor("#4CAF50") // Verde
                    } else {
                        val ppm = sensor.leituraAtual
                        if (ppm < 50) {
                            statusTexto = "Estável"
                            corStatusInt = Color.parseColor("#4CAF50")
                        } else if (ppm < 100) {
                            statusTexto = "Atenção"
                            corStatusInt = Color.parseColor("#FFC107")
                        } else {
                            statusTexto = "Alerta!"
                            corStatusInt = Color.parseColor("#F44336")
                        }
                    }

                    val ppmValor = sensor.leituraAtual
                    val corPpmInt = if (ppmValor < 50) {
                        Color.parseColor("#4CAF50")
                    } else if (ppmValor < 100) {
                        Color.parseColor("#FFC107")
                    } else {
                        Color.parseColor("#F44336")
                    }

                    txtStatus.text = statusTexto
                    viewCorStatus.setBackgroundColor(corStatusInt)
                    txtStatus.setTextColor(corStatusInt)
                    txtNivelFumaca.setTextColor(corPpmInt)

                } catch (e: Exception) {
                    Log.e("VisualizacaoActivity", "Erro ao atualizar sensor: ${e.message}")
                    // txtUltimaLeitura.text = "Conexão perdida..." (Opcional)
                }

                delay(5000) // Atualiza a cada 5 segundos
            }
        }
    }

    private fun parseDate(dataString: String?): Date? {
        if (dataString.isNullOrEmpty()) return null
        return try {
            val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            isoFormat.timeZone = TimeZone.getTimeZone("UTC")
            isoFormat.parse(dataString)
        } catch (e: Exception) {
            try {
                val simpleFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                simpleFormat.parse(dataString)
            } catch (e2: Exception) {
                null
            }
        }
    }
}
