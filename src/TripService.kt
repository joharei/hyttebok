package app.reitan.hyttebok

import app.reitan.hyttebok.models.TripDao
import app.reitan.hyttebok.models.Trips
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.transactions.transaction

class TripService {

    suspend fun getAllTrips(): List<TripDao> = dbQuery {
        TripDao.all()
            .sortedByDescending(TripDao::id)
    }

    suspend fun getTrip(slug: String): TripDao = dbQuery {
        TripDao.find { Trips.slug eq slug }.single()
    }

    private suspend fun <T> dbQuery(block: () -> T): T = withContext(Dispatchers.IO) {
        transaction { block() }
    }


}