package app.reitan.hyttebok

import com.apurebase.kgraphql.context
import com.apurebase.kgraphql.schema.Schema
import com.google.firebase.auth.FirebaseAuth
import com.google.gson.Gson
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.locations.Location
import io.ktor.locations.post
import io.ktor.request.authorization
import io.ktor.request.receive
import io.ktor.response.respondText
import io.ktor.routing.Route
import org.slf4j.Logger

@Location("/graphql")
data class GraphQLRequest(val query: String = "", val variables: Map<String, Any> = emptyMap())

data class GraphQLErrors(val e: Exception)

fun GraphQLErrors.asMap(): Map<String, Map<String, String>> {
    return mapOf(
        "errors" to mapOf(
            "message" to "Caught ${e.javaClass.simpleName}: ${e.message?.replace("\"", "")}"
        )
    )
}

data class UserData(val isAdmin: Boolean)

fun Route.graphql(log: Logger, gson: Gson, schema: Schema) {
    post<GraphQLRequest> {
        val request = call.receive<GraphQLRequest>()

        val query = request.query
        log.info("the graphql query: $query")

        val variables = gson.toJson(request.variables)
        log.info("the graphql variables: $variables")

        try {
            val isAdmin = call.request.authorization()
                ?.takeIf { it.isNotEmpty() }
                ?.let { authHeader ->
                    FirebaseAuth.getInstance().verifyIdToken(authHeader.replace("Bearer ", "")).let {
                        it.isEmailVerified && it.claims["admin"] == true
                    }
                } ?: false

            val result = schema.execute(query, variables, context { +UserData(isAdmin) })
            call.respondText(result, contentType = ContentType.parse("application/json"))
        } catch (e: Exception) {
            call.respondText(gson.toJson(GraphQLErrors(e).asMap()), status = (e as? HttpException)?.status)
        }
    }
}