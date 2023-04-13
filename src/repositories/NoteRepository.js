const knex = require('../database/knex')

const dayjs = require('dayjs')

class NoteRepository {
  async create({ title, description, rating, tags, user_id }) {
    const now = dayjs().format('DD.MM.YYYY HH:mm:ss')

    const [note_id] = await knex('Movie_notes').insert({
      title,
      description,
      rating,
      user_id,
      created_at: now,
      updated_at: now
    })

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        user_id,
        name
      }
    })

    await knex('Movie_tags').insert(tagsInsert)

    return { id: note_id }
  }
}

module.exports = NoteRepository
