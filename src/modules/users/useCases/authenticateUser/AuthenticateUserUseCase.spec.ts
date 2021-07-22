import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to get info about authenticated user', async () => {
    const user = {
      email: "teste@email.com.br",
      name: "Usuario teste",
      password: "123456"
    }

    await inMemoryUsersRepository.create(user)

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticatedUser).toHaveProperty('token')
  })

  it('should not be able to get info about a non existent user', async () => {
    expect(async () => {
      const user = {
        email: "teste@email.com.br",
        name: "Usuario teste",
        password: "123456"
      }

      await inMemoryUsersRepository.create(user)

      await authenticateUserUseCase.execute({
        email: 'wrong@email.com.br',
        password: user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to get info about an user with wrong password', async () => {
    expect(async () => {
      const user = {
        email: "teste@email.com.br",
        name: "Usuario teste",
        password: "123456"
      }

      await inMemoryUsersRepository.create(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong-password'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
