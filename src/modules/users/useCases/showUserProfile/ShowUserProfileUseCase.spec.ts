import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO'
import { ShowUserProfileError } from './ShowUserProfileError'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Show User Profile UseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )

    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to find an authenticated user', async () => {
    const user: ICreateUserDTO = {
      email: "usuario@teste.com.br",
      name: "Usuario",
      password: "usuario"
    }

    await createUserUseCase.execute(user)
    const userFound = await inMemoryUsersRepository.findByEmail(user.email)

    if (userFound && userFound?.id) {
      const userProfile = await showUserProfileUseCase.execute(userFound.id)

      expect(userProfile).toHaveProperty('id')
    }
  })

  it('should not be able to find non authenticated user', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "usuario@email.com.br",
        name: "Usuario",
        password: "usuario"
      }

      await createUserUseCase.execute(user)
      await showUserProfileUseCase.execute('Wrong_id')

    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })

})
