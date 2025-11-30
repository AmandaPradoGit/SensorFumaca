package com.example.mq_fire.data.api

import com.example.mq_fire.data.model.AuthRequest
import com.example.mq_fire.data.model.Sensor
import com.example.mq_fire.data.model.User
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface MqFireApiService {

    @POST("entrar")
    suspend fun login(@Body request: AuthRequest): User

    @POST("cadastro")
    suspend fun register(@Body request: AuthRequest): User

    // TENTATIVA REST PADRÃO: Rota na raiz do recurso
    // Requer que no Node.js seja: router.post('/', ...) dentro do grupo '/api/sensores'
    @POST("api/sensores") 
    suspend fun cadastrarSensor(@Body sensor: Sensor): Sensor

    @GET("api/sensores")
    suspend fun listarSensores(@Query("idUsuario") idUsuario: Int): List<Sensor>

    @GET("api/sensores/{id}")
    suspend fun getSensorStatus(@Path("id") sensorId: String): Sensor
}
