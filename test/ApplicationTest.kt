package app.reitan.hyttebok

import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.locations.KtorExperimentalLocationsAPI
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse

@KtorExperimentalLocationsAPI
class ApplicationTest {
    @Test
    fun testRoot() {
        withTestApplication({
            module(testing = true)
            routes()
        }) {
            handleRequest(HttpMethod.Post, "/graphql") {
                addHeader("Content-Type", "application/json")
                setBody(
                    """
                    {
                      "query": "{\n  trips {\n    name\n    text\n  }\n}"
                    }
                """.trimIndent()
                )
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertFalse(response.content.isNullOrEmpty())
            }
        }
    }
}
