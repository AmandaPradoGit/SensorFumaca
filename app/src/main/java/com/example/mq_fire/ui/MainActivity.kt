package com.example.mq_fire.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.mq_fire.R

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // --- VERIFICAÇÃO DE SESSÃO ---
        val sharedPreferences = getSharedPreferences("user_session", MODE_PRIVATE)
        val userId = sharedPreferences.getInt("USER_ID", -1) // Pega o ID, ou -1 se não encontrar

        if (userId != -1) {
            // Usuário já está logado, vá direto para a tela de sensores
            val intent = Intent(this, SensoresActivity::class.java)
            startActivity(intent)
            finish()
            return
        }
        setContentView(R.layout.activity_main)

        val btnEntrar = findViewById<Button>(R.id.btnEntrar)
        val btnCadastro = findViewById<Button>(R.id.btnCadastro)

        btnEntrar.setOnClickListener {
            val intent = Intent(this, EntrarActivity::class.java)
            startActivity(intent)
        }

        btnCadastro.setOnClickListener {
            val intent = Intent(this, CadastroActivity::class.java)
            startActivity(intent)
        }
    }
}
