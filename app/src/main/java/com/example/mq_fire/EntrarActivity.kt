package com.example.mq_fire

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button

class EntrarActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.entrar)

    val icon = findViewById<ImageView>(R.id.icon)
    val btnEntrar = findViewById<Button>(R.id.btnEntrar)

    icon.setOnClickListener {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
    }

    btnEntrar.setOnClickListener {
        val intent = Intent(this, SensoresActivity::class.java)
        startActivity(intent)
    }
}
}
