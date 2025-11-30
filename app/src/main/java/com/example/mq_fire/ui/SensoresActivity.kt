package com.example.mq_fire.ui

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mq_fire.R
import com.example.mq_fire.data.api.RetrofitInstance
import com.example.mq_fire.data.model.Sensor
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class SensoresActivity : AppCompatActivity() {
    private lateinit var adapter: SensoresAdapter
    private val CHANNEL_ID = "alerta_fumaça_channel"
    private var ultimoAlertaNotificado = 0L // Para não spammar notificações

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        criarCanalDeNotificacao() // Configura o canal para Android 8+

        // --- BARREIRA DE SEGURANÇA ---
        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
        val userId = sharedPreferences.getInt("USER_ID", -1)

        if (userId == -1) {
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
            return
        }

        setContentView(R.layout.sensores)

        val recyclerView = findViewById<RecyclerView>(R.id.recyclerViewSensores)
        recyclerView.layoutManager = LinearLayoutManager(this)

        adapter = SensoresAdapter(mutableListOf()) { sensorClicado ->
            val intent = Intent(this, VisualizacaoActivity::class.java)
            intent.putExtra("SENSOR_ID", sensorClicado.id)
            startActivity(intent)
        }
        recyclerView.adapter = adapter

        // --- POLLING: LOOP DE ATUALIZAÇÃO AUTOMÁTICA ---
        lifecycleScope.launch {
            while (isActive) {
                try {
                    val listaSensores = RetrofitInstance.api.listarSensores(userId)
                    adapter.atualizarLista(listaSensores)

                    // --- VERIFICAÇÃO DE ALERTA PARA NOTIFICAÇÃO ---
                    verificarAlertas(listaSensores)

                } catch (e: Exception) {
                    Log.e("SensoresActivity", "Erro ao atualizar sensores: ${e.message}")
                }
                delay(5000) // 5 segundos
            }
        }

        val btnAdicionarSensor = findViewById<TextView>(R.id.btnAdicionarSensor)
        val btnExit = findViewById<ImageView>(R.id.btnExit)

        btnAdicionarSensor.setOnClickListener {
            val intent = Intent(this, CadastrarSensorActivity::class.java)
            startActivity(intent)
        }

        btnExit.setOnClickListener {
            val editor = sharedPreferences.edit()
            editor.clear()
            editor.apply()

            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }

    private fun verificarAlertas(sensores: List<Sensor>) {
        val cincoMinutosMs = 5 * 60 * 1000
        val agora = System.currentTimeMillis()

        // Filtra sensores com leitura recente E nível alto de fumaça
        val sensoresEmAlerta = sensores.filter { sensor ->
            // Você pode usar a lógica de tempo aqui se quiser, ou confiar apenas no PPM
            // Exemplo: notificar se PPM > 100 (Vermelho)
            sensor.leituraAtual >= 100 
        }

        if (sensoresEmAlerta.isNotEmpty()) {
            // Evita mandar notificação a cada 5 segundos se o alerta for o mesmo
            // Manda apenas se passou 1 minuto desde o último aviso
            if (agora - ultimoAlertaNotificado > 60000) {
                val sensorAlerta = sensoresEmAlerta.first()
                mostrarNotificacao("Alerta de Fumaça!", "Nível crítico na sala: ${sensorAlerta.nomeSala} (${sensorAlerta.leituraAtual} PPM)")
                ultimoAlertaNotificado = agora
            }
        }
    }

    private fun mostrarNotificacao(titulo: String, mensagem: String) {
        // Verifica permissão no Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                // Se não tiver permissão, pede (simplesmente não mostra desta vez)
                ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1)
                return
            }
        }

        val intent = Intent(this, SensoresActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent: PendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)

        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.icon) // Certifique-se que esse ícone existe
            .setContentTitle(titulo)
            .setContentText(mensagem)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        with(NotificationManagerCompat.from(this)) {
            notify(1, builder.build())
        }
    }

    private fun criarCanalDeNotificacao() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Alerta de Fumaça"
            val descriptionText = "Notificações de nível crítico de fumaça"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}
