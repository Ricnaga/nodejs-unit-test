import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserError } from './CreateUserError'
import { CreateUserUseCase } from './CreateUserUseCase'


let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User UseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to create a new user', async () => {
    const user = {
      name: 'usuario',
      email: 'usuario@test.com.br',
      password: '123456'
    }

    await createUserUseCase.execute(user)

    const userFound = await inMemoryUsersRepository.findByEmail(user.email)

    expect(userFound).toHaveProperty('id')
  })

  it('should not be able to create the same user twice', async () => {
    expect(async () => {
      const user = {
        name: 'usuario',
        email: 'usuario@test.com.br',
        password: '123456'
      }

      await createUserUseCase.execute(user)
      await createUserUseCase.execute(user)
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
