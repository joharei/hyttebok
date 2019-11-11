package app.reitan.hyttebok.graphql

import app.reitan.hyttebok.DBService
import app.reitan.hyttebok.models.TripDao
import com.apurebase.kgraphql.KGraphQL
import org.joda.time.LocalDate

class AppSchema(private val service: DBService) {

    val schema = KGraphQL.schema {

        type<Trip> {
            description = "A trip to the cabin"
        }

        stringScalar<LocalDate> {
            serialize = LocalDate::toString
            deserialize = LocalDate::parse
        }

        query("trips") {
            resolver<List<Trip>> {
                service.getAllTrips()
                    .map(::Trip)
            }
        }

        query("trip") {
            resolver { slug: String ->
                Trip(service.getTrip(slug))
            }
        }

        query("isUserAuthorized") {
            resolver { firebaseUid: String ->
                service.isUserAuthorized(firebaseUid)
            }
        }
    }
}

data class Trip(
    val id: Int,
    val title: String,
    val slug: String,
    val text: String,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val photos: String
) {
    constructor(tripDao: TripDao) : this(
        tripDao.id.value,
        tripDao.title,
        tripDao.slug,
        tripDao.text,
        tripDao.startDate.toLocalDate(),
        tripDao.endDate.toLocalDate(),
        tripDao.photos
    )
}

@Suppress("unused")
class Dummy(val dummy: String = "")