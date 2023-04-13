const AppError = require('../utils/AppError')

class NoteCreateService {
  constructor(noteRepository) {
    this.noteRepository = noteRepository
  }

  async execute({ title, description, rating, tags, user_id }) {
    if (rating == null || rating < 1 || rating > 5) {
      throw new AppError('Insira uma nota entre 1 e 5')
    }

    const noteCreated = await this.noteRepository.create({
      title,
      description,
      rating,
      tags,
      user_id
    })

    return noteCreated
  }
}

module.exports = NoteCreateService
