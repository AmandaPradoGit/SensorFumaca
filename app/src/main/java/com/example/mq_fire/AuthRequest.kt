package com.example.mq_fire

data class AuthRequest(
    val email: String,
    val pass: String
)

data class User(
    val id: Int,
    val email: String
)