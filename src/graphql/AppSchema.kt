package app.reitan.hyttebok.graphql

import app.reitan.hyttebok.TripService
import app.reitan.hyttebok.models.TripDao
import com.github.pgutkowski.kgraphql.KGraphQL
import org.joda.time.DateTime
import org.koin.core.Koin

class AppSchema(private val service: TripService) {

    val schema = KGraphQL.schema {

        type<Trip> {
            description = "A trip to the cabin"
        }

        stringScalar<DateTime> {
            serialize = DateTime::toString
            deserialize = DateTime::parse
        }

        query("trips") {
            suspendResolver<List<Trip>> {
                service.getAllTrips()
                    .map(::Trip)
            }
        }

        query("trip") {
            suspendResolver { slug: String ->
                Trip(service.getTrip(slug))
            }
        }

        mutation("doNothing") {
            description = "Does nothing"
            resolver { a: String ->
                Koin.logger.info("called mutation with $a")
                Dummy()
            }
        }

        type<Dummy>()
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

@Suppress("unused")
class Dummy(val dummy: String = "")