import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO'
import { OperationType } from '../../entities/Statement'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementError } from './CreateStatementError'
import { CreateStatementUseCase } from './CreateStatementUseCase'
import { ICreateStatementDTO } from './ICreateStatementDTO'

let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create Statement UseCase', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, inMemoryStatementsRepository
    )
  })

  it('should be able to create a new statement', async () => {
    const newUser: ICreateUserDTO = {
      email: "user@email.com.br",
      name: "User test",
      password: "123456"
    }

    const user = await inMemoryUsersRepository.create(newUser)

    if (user.id) {
      const statementCreated: ICreateStatementDTO = {
        user_id: user.id,
        amount: 1550.0,
        description: "Description test",
        type: "deposit" as OperationType,
      }

      const createStatement = await createStatementUseCase.execute(statementCreated)

      expect(createStatement).toHaveProperty('id')
    }

  })

  it('should not be able to do any operation with a non existent user', () => {
    expect(async () => {
      const user_id = 'non-existent-id'

        const statementCreated: ICreateStatementDTO = {
          user_id,
          amount: 1550.0,
          description: "Description test",
          type: "withdraw" as OperationType,
        }

       await createStatementUseCase.execute(statementCreated)

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

  })

  it('should not be able to do withdraw bigger than amount on statement', () => {
    expect(async () => {
      const newUser: ICreateUserDTO = {
        email: "user@email.com.br",
        name: "User test",
        password: "123456"
      }

      const user = await inMemoryUsersRepository.create(newUser)

      if (user.id) {
        const statementCreated: ICreateStatementDTO = {
          user_id: user.id,
          amount: 1550.0,
          description: "Description test",
          type: "withdraw" as OperationType,
        }

        await createStatementUseCase.execute(statementCreated)

      }
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)

  })

  // it('should not be able to create the same user twice', async () => {
  //   expect(async () => {
  //     const user = {
  //       name: 'usuario',
  //       email: 'usuario@test.com.br',
  //       password: '123456'
  //     }

  //     await createUserUseCase.execute(user)
  //     await createUserUseCase.execute(user)
  //   }).rejects.toBeInstanceOf(CreateUserError)
  // })
})