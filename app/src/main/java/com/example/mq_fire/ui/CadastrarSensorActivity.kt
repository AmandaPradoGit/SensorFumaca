package com.example.mq_fire.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.EditText
import com.example.mq_fire.R
import com.example.mq_fire.data.model.Sensor
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import com.example.mq_fire.data.api.RetrofitInstance
import kotlinx.coroutines.launch

class CadastrarSensorActivity : AppCompatActivity() {
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

        // se o usuário estiver logado
        setContentView(R.layout.cadastrarsensor)

        val icon = findViewById<ImageView>(R.id.icon)
        val btnCadastrar = findViewById<Button>(R.id.btnCadastrar)
        val txtNomeSala= findViewById<EditText>(R.id.txtNomeSala)
        val txtIdSensor= findViewById<EditText>(R.id.txtIdSensor)

        icon.setOnClickListener {
            val intent = Intent(this, SensoresActivity::class.java)
            startActivity(intent)
        }

        btnCadastrar.setOnClickListener {
            val idSensor = txtIdSensor.text.toString()
            val nomeSala = txtNomeSala.text.toString()

            if(nomeSala.isEmpty() || idSensor.isEmpty()){
                Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val request = Sensor(idSensor, nomeSala, userId)

            lifecycleScope.launch {
                try{
                    val response = RetrofitInstance.api.cadastrarSensor(request)

                    Toast.makeText(this@CadastrarSensorActivity, "Sensor '${response.nomeSala}' cadastrado com sucesso!", Toast.LENGTH_LONG).show()

                    val intent = Intent(this@CadastrarSensorActivity, SensoresActivity::class.java)
                    startActivity(intent)
                    finish()
                } catch (e: Exception) {
                    Log.e("CadastrarSensorActivity", "Falha no registro do sensor: ${e.message}")
                    Toast.makeText(this@CadastrarSensorActivity, "Falha no registro. O ID do sensor pode já estar em uso.", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
