package app.reitan.hyttebok

import app.reitan.hyttebok.graphql.AppSchema
import com.google.gson.Gson
import io.ktor.application.Application
import io.ktor.application.log
import io.ktor.routing.routing
import org.koin.ktor.ext.inject

@Suppress("unused")
fun Application.routes() {
    routing {
        val appSchema: AppSchema by inject()
        val gson: Gson by inject()

        graphql(log, gson, appSchema.schema)
    }
}