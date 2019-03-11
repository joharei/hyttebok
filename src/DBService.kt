package app.reitan.hyttebok

import app.reitan.hyttebok.models.AuthUserDao
import app.reitan.hyttebok.models.AuthUsers
import app.reitan.hyttebok.models.TripDao
import app.reitan.hyttebok.models.Trips
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.DateTime

class DBService {

    suspend fun getAllTrips(): List<TripDao> = dbQuery {
        TripDao.all()
            .sortedByDescending(TripDao::id)
    }

    suspend fun getTrip(slug: String): TripDao = dbQuery {
        TripDao.find { Trips.slug eq slug }.single()
    }

    suspend fun isUserAuthorized(firebaseUid: String): Boolean = dbQuery {
        when(val user = AuthUserDao.find { AuthUsers.firebaseUid eq firebaseUid }.singleOrNull()) {
            null -> false
            else -> {
                user.lastLogin = DateTime.now()
                true
            }
        }
    }

    private suspend fun <T> dbQuery(block: () -> T): T = withContext(Dispatchers.IO) {
        transaction { block() }
    }

}