const knex = require('../database/knex')
const notesRoutes = require('../routes/notes.routes')
const AppError = require('../utils/AppError')

const dayjs = require('dayjs')

class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body
    const user_id = request.user.id

    const now = dayjs().format('DD.MM.YYYY HH:mm:ss')

    if (rating < 1 || rating > 5) {
      throw new AppError('Insira uma nota entre 1 e 5')
    }

    const note_id = await knex('Movie_notes').insert({
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

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex('Movie_notes').where({ id }).first()
    const tags = await knex('Movie_tags').where({ note_id: id }).orderBy('name')

    return response.json({
      ...note,
      tags
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('Movie_notes').where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { title, tags } = request.query

    const user_id = request.user.id

    let notes

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex('Movie_tags')
        .select([
          'Movie_notes.id',
          'Movie_notes.title',
          'Movie_notes.description',
          'Movie_notes.user_id',
          'Movie_notes.created_at',
          'Movie_notes.updated_at'
        ])
        .where('Movie_notes.user_id', user_id)
        .whereLike('Movie_notes.title', `%${title}%`)
        .whereIn('name', filterTags)
        .innerJoin('Movie_notes', 'Movie_notes.id', 'Movie_tags.note_id')
        .groupBy('Movie_notes.id')
        .orderBy('Movie_notes.title')
    } else {
      notes = await knex('Movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')
    }

    const userTags = await knex('Movie_tags').where({ user_id })
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })

    return response.json(notesWithTags)
  }
}

module.exports = NotesController
