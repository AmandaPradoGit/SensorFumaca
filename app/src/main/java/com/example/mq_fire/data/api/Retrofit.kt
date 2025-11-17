package com.example.mq_fire.data.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitInstance {
    // Com o comando 'adb reverse', o app pode acessar o 'localhost' do computador
    private const val BASE_URL = "http://localhost:3000/"

    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val api: MqFireApiService by lazy {
        retrofit.create(MqFireApiService::class.java)
    }
}
