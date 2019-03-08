package app.reitan.hyttebok.graphql

import app.reitan.hyttebok.models.TripDao
import com.github.pgutkowski.kgraphql.KGraphQL
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.DateTime

class AppSchema {

    val schema = KGraphQL.schema {

        type<Trip> {
            description = "A trip to the cabin"
        }

        stringScalar<DateTime> {
            serialize = DateTime::toString
            deserialize = DateTime::parse
        }

        query("trips") {
            resolver<List<Trip>> {
                transaction {
                    TripDao.all().map(::Trip)
                }
            }
        }

        query("trip") {
            resolver { id: Int ->
                transaction {
                    TripDao[id].let(::Trip)
                }
            }
        }
    }
}

data class Trip(
    val id: Int,
    val title: String,
    val slug: String,
    val text: String,
    val startDate: DateTime,
    val endDate: DateTime,
    val photos: String
) {
    constructor(tripDao: TripDao) : this(
        tripDao.id.value,
        tripDao.title,
        tripDao.slug,
        tripDao.text,
        tripDao.startDate,
        tripDao.endDate,
        tripDao.photos
    )
}