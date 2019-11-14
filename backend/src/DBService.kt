package app.reitan.hyttebok

import app.reitan.hyttebok.graphql.TripInput
import app.reitan.hyttebok.models.TripDao
import app.reitan.hyttebok.models.Trips
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.transactions.transaction

class DBService {

    suspend fun getAllTrips(): List<TripDao> = dbQuery {
        TripDao.all()
            .sortedByDescending(TripDao::id)
    }

    suspend fun getTrip(slug: String): TripDao = dbQuery {
        TripDao.find { Trips.slug eq slug }.single()
    }

    suspend fun saveTrip(trip: TripInput): TripDao = dbQuery {
        if (trip.id != null) {
            TripDao[trip.id].apply {
                title = trip.title
                slug = trip.slug
                text = trip.text
                startDate = trip.startDate.toDateTimeAtStartOfDay()
                endDate = trip.endDate.toDateTimeAtStartOfDay()
            }
        } else {
            TripDao.new {
                title = trip.title
                slug = trip.slug
                text = trip.text
                startDate = trip.startDate.toDateTimeAtStartOfDay()
                endDate = trip.endDate.toDateTimeAtStartOfDay()
            }
        }
    }

    private suspend fun <T> dbQuery(block: () -> T): T = withContext(Dispatchers.IO) {
        transaction { block() }
    }

}