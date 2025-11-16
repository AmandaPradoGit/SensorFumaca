package com.example.mq_fire

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView

class SensoresActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.sensores)

        val btnAdicionarSensor = findViewById<TextView>(R.id.btnAdicionarSensor)
        val btnExit = findViewById<ImageView>(R.id.btnExit)

        btnAdicionarSensor.setOnClickListener {
            val intent = Intent(this, CadastrarSensorActivity::class.java)
            startActivity(intent)
        }

        btnExit.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            // Flags para limpar a pilha de atividades e não empilhar telas
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }
}
