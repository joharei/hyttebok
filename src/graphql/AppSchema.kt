package app.reitan.hyttebok.graphql

import com.github.pgutkowski.kgraphql.KGraphQL

class AppSchema {

    private val trips = (1..100).map { Trip("Trip no. $it", "This was a great trip") }

    val schema = KGraphQL.schema {

        query("trips") {
            resolver<List<Trip>> { trips }
        }
    }
}

data class Trip(
    val name: String,
    val text: String
)