package app.reitan.hyttebok.models

import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable

object AuthUsers : IntIdTable("auth_user") {
    val firebaseUid = varchar("firebase_uid", 30)
    val email = varchar("email", 254)
    val username = varchar("username", 150)
    val firstName = varchar("first_name", 30)
    val lastName = varchar("last_name", 30)
    val lastLogin = datetime("last_login")
}

class AuthUserDao(id: EntityID<Int>) : IntEntity(id) {
    var firebaseUid by AuthUsers.firebaseUid
    var email by AuthUsers.email
    var username by AuthUsers.username
    var firstName by AuthUsers.firstName
    var lastName by AuthUsers.lastName
    var lastLogin by AuthUsers.lastLogin

    companion object : IntEntityClass<AuthUserDao>(AuthUsers)
}