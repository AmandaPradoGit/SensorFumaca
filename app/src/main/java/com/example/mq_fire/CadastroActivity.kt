package com.example.mq_fire

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button

class CadastroActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.cadastro)

        val icon = findViewById<ImageView>(R.id.icon)
        val btnCadastrar = findViewById<Button>(R.id.btnCadastrar)

        icon.setOnClickListener{
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        btnCadastrar.setOnClickListener{
            val intent = Intent(this, SensoresActivity::class.java)
            startActivity(intent)
        }
    }
}
