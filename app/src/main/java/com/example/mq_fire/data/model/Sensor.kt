package com.example.mq_fire.data.model

import com.google.gson.annotations.SerializedName

data class Sensor(

    @SerializedName("chave_sensor")
    val id: String,

    @SerializedName("nome_local")
    val nomeSala: String,

    @SerializedName("idUsuario")
    val idUsuario: Int,

    @SerializedName("leitura_atual")
    val leituraAtual: Int = 0, // Ex: 25

    @SerializedName("status")
    val status: String = "Estável"
)
