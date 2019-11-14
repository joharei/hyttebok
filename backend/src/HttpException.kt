package app.reitan.hyttebok

import io.ktor.http.HttpStatusCode
import kotlin.Exception

sealed class HttpException(override val message: String) : Exception(message) {
    abstract val status: HttpStatusCode
}

class ForbiddenException(override val message: String) : HttpException(message) {
    override val status = HttpStatusCode.Forbidden
}