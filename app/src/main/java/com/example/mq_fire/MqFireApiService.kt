package com.example.mq_fire

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface MqFireApiService {

    @POST("entrar")
    suspend fun login(@Body request: AuthRequest): User

    @POST("cadastro")
    suspend fun register(@Body request: AuthRequest): User

    @GET("sensores/{id}")
    suspend fun getSensorStatus(@Path("id") sensorId: String): Sensor
}
