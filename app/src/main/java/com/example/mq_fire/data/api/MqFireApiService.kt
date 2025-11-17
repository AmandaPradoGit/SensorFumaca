package com.example.mq_fire.data.api

import com.example.mq_fire.data.model.AuthRequest
import com.example.mq_fire.data.model.Sensor
import com.example.mq_fire.data.model.User
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface MqFireApiService {

    // --- Rotas de Usuário ---
    @POST("entrar")
    suspend fun login(@Body request: AuthRequest): User

    @POST("cadastro")
    suspend fun register(@Body request: AuthRequest): User

    // --- Rotas de Sensor ---
    @POST("sensores")
    suspend fun cadastrarSensor(@Body sensor: Sensor): Sensor // A API deve retornar o sensor criado

    @GET("sensores/{id}")
    suspend fun getSensorStatus(@Path("id") sensorId: String): Sensor
}
