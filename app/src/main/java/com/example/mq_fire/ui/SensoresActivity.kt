package com.example.mq_fire.ui

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mq_fire.R
import com.example.mq_fire.data.model.Sensor

class SensoresActivity : AppCompatActivity() {
    private lateinit var adapter: SensoresAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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

        // 1. INICIALIZAR O RECYCLER VIEW (Faltava isso)
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerViewSensores)
        recyclerView.layoutManager = LinearLayoutManager(this)

        val listaFalsa = listOf(
            Sensor("MQ-01", "Cozinha", 1, 25, "Estável"),
            Sensor("MQ-02", "Sala 1", 1, 80, "Alerta"),
            Sensor("MQ-03", "Sala 2", 1, 250, "Perigo")
        )

        adapter = SensoresAdapter(listaFalsa) { sensorClicado ->
            val intent = Intent(this, VisualizacaoActivity::class.java)
            intent.putExtra("SENSOR_ID", sensorClicado.id)
            startActivity(intent)
        }

        recyclerView.adapter = adapter

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
}
