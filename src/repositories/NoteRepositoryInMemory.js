class NoteRepositoryInMemory {
  notes = []

  async create({ title, description, rating, tags, user_id }) {
    const note = {
      id: Math.floor(Math.random() * 1000) + 1,
      title,
      description,
      rating,
      tags,
      user_id
    }

    this.notes.push(note)

    return note
  }
}

module.exports = NoteRepositoryInMemory
