package app.reitan.hyttebok.models

import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable

object Trips : IntIdTable("trip") {
    val title = varchar("title", 100)
    val slug = varchar("slug", 100)
    val text = text("text")
    val startDate = date("start_date")
    val endDate = date("end_date")
    val photos = varchar("photos", 100)
}

class TripDao(id: EntityID<Int>) : IntEntity(id) {
    var title by Trips.title
    var slug by Trips.slug
    var text by Trips.text
    var startDate by Trips.startDate
    var endDate by Trips.endDate
    var photos by Trips.photos

    companion object : IntEntityClass<TripDao>(Trips)
}