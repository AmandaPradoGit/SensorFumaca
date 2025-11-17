package com.example.mq_fire.ui

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView
import com.example.mq_fire.R

class SensoresActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // --- BARREIRA DE SEGURANÇA ---
        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
        val userId = sharedPreferences.getInt("USER_ID", -1)

        if (userId == -1) {
            // Se não há usuário logado, não prossiga. Volte para a tela inicial.
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
            return
        }

        // Apenas prossiga se o usuário estiver logado
        setContentView(R.layout.sensores)

        val btnAdicionarSensor = findViewById<TextView>(R.id.btnAdicionarSensor)
        val btnExit = findViewById<ImageView>(R.id.btnExit)

        btnAdicionarSensor.setOnClickListener {
            val intent = Intent(this, CadastrarSensorActivity::class.java)
            startActivity(intent)
        }

        btnExit.setOnClickListener {
            // 1. Limpar os dados da sessão
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
