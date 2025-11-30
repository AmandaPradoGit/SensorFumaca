package com.example.mq_fire.ui

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.mq_fire.R
import com.example.mq_fire.data.model.Sensor
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class SensoresAdapter(
    private var sensores: MutableList<Sensor>, // Mudou de List para MutableList e var
    private val onClick: (Sensor) -> Unit
) : RecyclerView.Adapter<SensoresAdapter.SensorViewHolder>() {

    // Função para atualizar a lista sem recriar o Adapter
    fun atualizarLista(novosSensores: List<Sensor>) {
        sensores.clear()
        sensores.addAll(novosSensores)
        notifyDataSetChanged()
    }

    class SensorViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nomeSala: TextView = itemView.findViewById(R.id.txtNomeSala)
        val sensorId: TextView = itemView.findViewById(R.id.txtSensorId)
        val leituraValor: TextView = itemView.findViewById(R.id.txtLeituraValor)
        val statusTexto: TextView = itemView.findViewById(R.id.txtStatusTexto)
        val ultimaLeitura: TextView = itemView.findViewById(R.id.txtUltimaLeitura)
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
        holder.sensorId.text = "Sensor: ${sensor.id}"
        holder.leituraValor.text = "${sensor.leituraAtual} PPM"

        // Formatar a data
        val dataObjeto = parseDate(sensor.dataHora)
        val dataFormatada = if (dataObjeto != null) {
            val outputFormat = SimpleDateFormat("dd/MM HH:mm", Locale.getDefault())
            outputFormat.format(dataObjeto)
        } else {
            "--"
        }
        holder.ultimaLeitura.text = "Última leitura: $dataFormatada"

        // --- LÓGICA DE STATUS E COR ---
        val cincoMinutosMs = 5 * 60 * 1000
        val agora = System.currentTimeMillis()
        
        val isLeituraAntiga = dataObjeto != null && (agora - dataObjeto.time > cincoMinutosMs)

        val statusTexto: String
        val corInt: Int

        if (isLeituraAntiga) {
            statusTexto = "Estável"
            corInt = Color.parseColor("#4CAF50")
        } else {
            val ppm = sensor.leituraAtual
            if (ppm < 50) {
                statusTexto = "Estável"
                corInt = Color.parseColor("#4CAF50")
            } else if (ppm < 100) {
                statusTexto = "Atenção"
                corInt = Color.parseColor("#FFC107")
            } else {
                statusTexto = "Alerta!"
                corInt = Color.parseColor("#F44336")
            }
        }

        holder.statusTexto.text = statusTexto
        holder.viewStatusColor.setBackgroundColor(corInt)
        holder.dotStatus.background.setTint(corInt)
        holder.statusTexto.setTextColor(corInt)
        holder.leituraValor.setTextColor(corInt)

        holder.itemView.setOnClickListener { onClick(sensor) }
    }

    override fun getItemCount() = sensores.size

    private fun parseDate(dataString: String?): Date? {
        if (dataString.isNullOrEmpty()) return null
        return try {
            val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            isoFormat.timeZone = TimeZone.getTimeZone("UTC")
            isoFormat.parse(dataString)
        } catch (e: Exception) {
            try {
                val simpleFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                simpleFormat.parse(dataString)
            } catch (e2: Exception) {
                null
            }
        }
    }
}
