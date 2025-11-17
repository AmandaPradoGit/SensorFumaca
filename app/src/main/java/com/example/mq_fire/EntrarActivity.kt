package com.example.mq_fire

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class EntrarActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.entrar)

        val icon = findViewById<ImageView>(R.id.icon)
        val btnEntrar = findViewById<Button>(R.id.btnEntrar)
        val txtEmail = findViewById<EditText>(R.id.txtEmail)
        val txtSenha = findViewById<EditText>(R.id.txtSenha)

        icon.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        btnEntrar.setOnClickListener {
            val email = txtEmail.text.toString()
            val pass = txtSenha.text.toString()

            if (email.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val request = AuthRequest(email, pass)

            lifecycleScope.launch {
                try {
                    val user = RetrofitInstance.api.login(request)
                    // SUCESSO!
                    Toast.makeText(this@EntrarActivity, "Bem-vindo, ${user.email}!", Toast.LENGTH_LONG).show()

                    val intent = Intent(this@EntrarActivity, SensoresActivity::class.java)
                    startActivity(intent)
                    finishAffinity() // Fecha a tela de login e todas as anteriores

                } catch (e: Exception) {
                    // ERRO!
                    Log.e("EntrarActivity", "Falha no login: ${e.message}")
                    // O erro 401 (Unauthorized) do seu servidor será pego aqui.
                    Toast.makeText(this@EntrarActivity, "Email ou senha inválidos.", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
