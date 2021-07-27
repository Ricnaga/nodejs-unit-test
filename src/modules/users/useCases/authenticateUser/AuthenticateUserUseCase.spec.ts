import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'
import authConfig from '../../../../config/auth';
let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    )
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to get info about authenticated user', async () => {
    const user = {
      email: "teste1@email.com.br",
      name: "Usuario_teste1",
      password: "123456"
    }

    await createUserUseCase.execute(user)

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticatedUser).toHaveProperty('token')
  })

  it('should not be able to get info about a non existent user', async () => {
    const user = {
      email: "teste2@email.com.br",
      name: "Usuario_teste2",
      password: "123456"
    }

    const createdUser = await createUserUseCase.execute(user)

    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong@email.com.br',
        password: createdUser.password
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })

  it('should not be able to get info about an user with wrong password', async () => {
    const user = {
      email: "teste3@email.com.br",
      name: "Usuario_teste3",
      password: "123456"
    }

    const createdUser = await createUserUseCase.execute(user)

    await expect(
      authenticateUserUseCase.execute({
        email: createdUser.email,
        password: 'wrong-password'
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })
})
