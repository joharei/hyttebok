package app.reitan.hyttebok.graphql

import app.reitan.hyttebok.DBService
import app.reitan.hyttebok.ForbiddenException
import app.reitan.hyttebok.UserData
import app.reitan.hyttebok.models.TripDao
import com.apurebase.kgraphql.KGraphQL
import org.joda.time.LocalDate

class AppSchema(private val service: DBService) {

    val schema = KGraphQL.schema {

        type<Trip> {
            description = "A trip to the cabin"
        }

        inputType<TripInput> {
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

        mutation("saveTrip") {
            accessRule { context -> if (context.get<UserData>()?.isAdmin == true) null else ForbiddenException("You shall not pass!") }

            resolver { trip: TripInput ->
                Trip(service.saveTrip(trip))
            }
        }

    }
}

sealed class TripBase {
    abstract val title: String
    abstract val slug: String
    abstract val text: String
    abstract val startDate: LocalDate
    abstract val endDate: LocalDate
}

data class Trip(
    val id: Int,
    override val title: String,
    override val slug: String,
    override val text: String,
    override val startDate: LocalDate,
    override val endDate: LocalDate,
    val photos: String
) : TripBase() {
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

data class TripInput(
    val id: Int?,
    override val title: String,
    override val slug: String,
    override val text: String,
    override val startDate: LocalDate,
    override val endDate: LocalDate
) : TripBase()