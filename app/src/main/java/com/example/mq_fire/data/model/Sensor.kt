package com.example.mq_fire.data.model

import com.google.gson.annotations.SerializedName

data class Sensor(

    @SerializedName("chave_sensor")
    val id: String,

    @SerializedName("nome_local")
    val nomeSala: String,

    @SerializedName("idUsuario")
    val idUsuario: Int
)
