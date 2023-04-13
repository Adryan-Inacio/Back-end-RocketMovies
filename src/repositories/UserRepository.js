const sqliteConnection = require('../database/sqlite')

const dayjs = require('dayjs')

class UserRepository {
  async findByEmail(email) {
    const database = await sqliteConnection()

    const user = await database.get('SELECT * FROM users WHERE email = (?)', [
      email
    ])

    return user
  }

  async create({ name, email, password }) {
    const database = await sqliteConnection()

    const now = dayjs().format('DD.MM.YYYY HH:mm:ss')

    const userId = await database.run(
      'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, now, now]
    )

    return { id: userId }
  }
}

module.exports = UserRepository
