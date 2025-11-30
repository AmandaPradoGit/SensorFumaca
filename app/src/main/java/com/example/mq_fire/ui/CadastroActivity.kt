package com.example.mq_fire.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mq_fire.R
import com.example.mq_fire.data.model.AuthRequest
import kotlinx.coroutines.launch
import com.example.mq_fire.data.api.RetrofitInstance

class CadastroActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.cadastro)

        val icon = findViewById<ImageView>(R.id.icon)
        val btnCadastrar = findViewById<Button>(R.id.btnCadastrar)
        val txtEmail = findViewById<EditText>(R.id.txtEmail)
        val txtSenha = findViewById<EditText>(R.id.txtSenha)

        icon.setOnClickListener{
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        btnCadastrar.setOnClickListener {
            val email = txtEmail.text.toString()
            val pass = txtSenha.text.toString()

            if (email.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val request = AuthRequest(email, pass)

            lifecycleScope.launch {
                try {
                    val user = RetrofitInstance.api.register(request)
                    // SUCESSO!
                    Toast.makeText(this@CadastroActivity, "Usuário criado com sucesso!", Toast.LENGTH_LONG).show()
                    
                    val intent = Intent(this@CadastroActivity, EntrarActivity::class.java)
                    startActivity(intent)
                    finish() // Fecha a tela de cadastro

                } catch (e: Exception) {
                    // ERRO!
                    Log.e("CadastroActivity", "Falha no registro: ${e.message}")
                    Toast.makeText(this@CadastroActivity, "Falha no registro. O email pode já estar em uso.", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
