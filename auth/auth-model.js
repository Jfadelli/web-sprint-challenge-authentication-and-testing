const db = require('../database/dbConfig');
const bcrypt = require('bcryptjs');

// function findBy(username){
//     return db('users').where({ username }).select('id', 'username', 'password')
// }
function findBy() {
    return db("users as u")
        .select("u.id", "u.username", "u.password")
        .orderBy("u.id");
}

function getUserById(id){
    return db('users').where({ id }).first()
}

async function add(user) {
    try {
        const [id] = await db("users").insert(user, "id");

        return getUserById(id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUserById,
    add,
    findBy,
}