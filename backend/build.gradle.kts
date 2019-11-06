val kotlin_version: String by project
val ktor_version: String by project
val logback_version: String by project
val exposed_version: String by project
val postgresql_version: String by project
val kgraphql_version: String by project
val koin_version: String by project

group = "hyttebok"
version = "0.0.1"

plugins {
    application
    kotlin("jvm") version "1.3.50"
}

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

repositories {
    mavenLocal()
    jcenter()
}

dependencies {
    // Kotlin
    compile(kotlin("stdlib-jdk8"))

    // Ktor Server
    compile("io.ktor:ktor-server-netty:$ktor_version")
    compile("io.ktor:ktor-server-core:$ktor_version")
    compile("io.ktor:ktor-gson:$ktor_version")
    compile("io.ktor:ktor-locations:$ktor_version")

    // Logging
    compile("ch.qos.logback:logback-classic:$logback_version")

    // Database
    compile("org.jetbrains.exposed:exposed:$exposed_version")
    compile("org.postgresql:postgresql:$postgresql_version")

    // GraphQL
    compile("com.apurebase:kgraphql:$kgraphql_version")

    // Dependency Injection
    compile("org.koin:koin-ktor:$koin_version")
    compile("org.koin:koin-logger-slf4j:$koin_version")
}

kotlin.sourceSets["main"].kotlin.srcDirs("src")
kotlin.sourceSets["test"].kotlin.srcDirs("test")

sourceSets["main"].resources.srcDirs("resources")
sourceSets["test"].resources.srcDirs("testresources")
