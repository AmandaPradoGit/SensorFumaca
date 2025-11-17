package com.example.mq_fire.data.model

import com.google.gson.annotations.SerializedName

data class Sensor(
    val id: String,
    
    // Usamos SerializedName para garantir que o nome do campo no JSON
    // seja o mesmo que no backend, mesmo que a variável tenha outro nome.
    @SerializedName("nomeSala")
    val nomeSala: String,

    @SerializedName("idUsuario")
    val idUsuario: Int 
)
