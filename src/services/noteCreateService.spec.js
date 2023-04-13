const NoteCreateService = require('./NoteCreateService')
const NoteRepositoryInMemory = require('../repositories/NoteRepositoryInMemory')

describe('NoteCreateService', () => {
  let noteRepositoryInMemory = null
  let noteCreateService = null

  beforeEach(() => {
    noteRepositoryInMemory = new NoteRepositoryInMemory()
    noteCreateService = new NoteCreateService(noteRepositoryInMemory)
  })

  it('note should be created', async () => {
    const note = {
      title: 'Note Teste',
      description: 'Description test',
      rating: '3',
      tags: 'Test',
      user_id: '1'
    }

    const noteCreated = await noteCreateService.execute(note)

    expect(noteCreated).toHaveProperty('id')
  })
})
