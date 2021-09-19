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
        type: OperationType.DEPOSIT,
      }

      const createStatement = await createStatementUseCase.execute(statementCreated)

      expect(createStatement).toHaveProperty('id')
    }

  })

  it('should not be able to do any operation with a non existent user', async () => {
    const user_id = 'non-existent-id'

    const statementCreated: ICreateStatementDTO = {
      user_id,
      amount: 1550.0,
      description: "Description test",
      type: OperationType.WITHDRAW,
    }

    await expect(
      createStatementUseCase.execute(statementCreated)
    ).rejects.toEqual(new CreateStatementError.UserNotFound)

  })

  it('should not be able to do withdraw bigger than amount on statement', async () => {
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
        type: OperationType.WITHDRAW,
      }

      await expect(
        createStatementUseCase.execute(statementCreated)
      ).rejects.toEqual(new CreateStatementError.InsufficientFunds)
    }
  })

})
