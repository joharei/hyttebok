plugins {
    kotlin("jvm")
}

group = "hyttebok"
version = "0.0.1"

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))

    implementation(project(":"))

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.3")
    implementation("org.jetbrains.exposed:exposed:0.17.5")

    implementation("org.slf4j:slf4j-nop:1.8.0-beta4")
    implementation("com.microsoft.graph:microsoft-graph:1.6.0")
    implementation("com.microsoft.azure:msal4j:1.1.0")
}

kotlin.sourceSets["main"].kotlin.srcDirs("src")
sourceSets["main"].resources.srcDirs("resources")

tasks {
    compileKotlin {
        kotlinOptions.jvmTarget = "1.8"
    }
    compileTestKotlin {
        kotlinOptions.jvmTarget = "1.8"
    }
}