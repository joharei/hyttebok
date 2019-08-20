package app.reitan.hyttebok

import app.reitan.hyttebok.di.mainModule
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.features.DefaultHeaders
import io.ktor.gson.gson
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.locations.KtorExperimentalLocationsAPI
import io.ktor.locations.Locations
import io.ktor.request.path
import org.jetbrains.exposed.sql.Database
import org.koin.Logger.slf4jLogger
import org.koin.ktor.ext.Koin
import org.slf4j.event.Level

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@KtorExperimentalLocationsAPI
@Suppress("unused", "UNUSED_PARAMETER") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    install(Koin) {
        slf4jLogger()
        modules(mainModule)
    }

    Database.connect(System.getenv("JDBC_DATABASE_URL"), driver = "org.postgresql.Driver")

    install(Locations)
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
    }
    install(DefaultHeaders) {
        header("X-Engine", "Ktor") // will send this header with each response
    }
    install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
        }
    }
    install(CORS) {
        method(HttpMethod.Post)
        header(HttpHeaders.ContentType)
        host("localhost:3000")
        host("localhost:8000")
        host("hyttebok.reitan.app", schemes = listOf("https"))
    }
}