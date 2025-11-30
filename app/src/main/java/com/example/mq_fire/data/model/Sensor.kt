package com.example.mq_fire.data.model

import com.google.gson.annotations.SerializedName

data class Sensor(
    @SerializedName("chave_sensor", alternate = ["id", "sensor_id", "chaveSensor", "identificador"])
    val id: String = "",

    @SerializedName("nome_local", alternate = ["nome", "nomeSala", "local", "nome_sala"])
    val nomeSala: String = "Sem Nome",

    @SerializedName("idUsuario", alternate = ["usuario_id", "usuarioId"])
    val idUsuario: Int = 0,

    @SerializedName("leitura_atual", alternate = ["leitura", "valor", "ppm", "ultima_leitura"])
    val leituraAtual: Int = 0, 

    @SerializedName("status", alternate = ["nivel"])
    val status: String = "Estável",

    // NOVO CAMPO: Data e Hora da última leitura
    // A query SQL retorna 'data_hora'
    @SerializedName("data_hora", alternate = ["dataHora", "timestamp", "ultimaLeituraData"])
    val dataHora: String? = null 
)
