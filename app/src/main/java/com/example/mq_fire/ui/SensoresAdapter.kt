package com.example.mq_fire.ui

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.mq_fire.R
import com.example.mq_fire.data.model.Sensor

class SensoresAdapter(
    private val sensores: List<Sensor>,
    private val onClick: (Sensor) -> Unit
) : RecyclerView.Adapter<SensoresAdapter.SensorViewHolder>() {

    class SensorViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nomeSala: TextView = itemView.findViewById(R.id.txtNomeSala)
        val sensorId: TextView = itemView.findViewById(R.id.txtSensorId)
        val leituraValor: TextView = itemView.findViewById(R.id.txtLeituraValor)
        val statusTexto: TextView = itemView.findViewById(R.id.txtStatusTexto)
        val viewStatusColor: View = itemView.findViewById(R.id.viewStatusColor)
        val dotStatus: View = itemView.findViewById(R.id.dotStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SensorViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.cardsensor, parent, false)
        return SensorViewHolder(view)
    }

    override fun onBindViewHolder(holder: SensorViewHolder, position: Int) {
        val sensor = sensores[position]

        holder.nomeSala.text = sensor.nomeSala
        holder.sensorId.text = "Sensor ID: ${sensor.id}"
        holder.leituraValor.text = "${sensor.leituraAtual} PPM"
        holder.statusTexto.text = sensor.status

        // Lógica de Cores
        val cor: Int
        val corTexto: Int

        // Você pode ajustar esses limites (50, 150) conforme a necessidade do seu sensor MQ-2
        if (sensor.leituraAtual < 50) {
            // Verde (Estável)
            cor = Color.parseColor("#4CAF50")
            corTexto = Color.parseColor("#4CAF50")
        } else if (sensor.leituraAtual < 150) {
            // Laranja (Alerta)
            cor = Color.parseColor("#FFC107")
            corTexto = Color.parseColor("#FFC107")
        } else {
            // Vermelho (Perigo)
            cor = Color.parseColor("#F44336")
            corTexto = Color.parseColor("#F44336")
        }

        holder.viewStatusColor.setBackgroundColor(cor)
        holder.dotStatus.background.setTint(cor)
        holder.statusTexto.setTextColor(corTexto)
        holder.leituraValor.setTextColor(corTexto)

        // Configura o clique no cartão
        holder.itemView.setOnClickListener { onClick(sensor) }
    }

    override fun getItemCount() = sensores.size
}
