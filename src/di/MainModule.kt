package app.reitan.hyttebok.di

import app.reitan.hyttebok.graphql.AppSchema
import com.google.gson.Gson
import org.koin.dsl.module.module

val mainModule = module {
    single { AppSchema() }
    single { Gson() }
}