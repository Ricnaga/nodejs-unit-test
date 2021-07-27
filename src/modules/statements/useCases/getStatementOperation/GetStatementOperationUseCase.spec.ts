import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createStatementUseCase: CreateStatementUseCase

describe('Get Statement Operation Use Case', () => {

  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, inMemoryStatementsRepository
    )

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository, inMemoryStatementsRepository
    )

    await inMemoryUsersRepository.create({
      name: "Usuario teste",
      email: "Usuario@email.com.br",
      password: '123456'
    })
  })

  it('should be able to get info about withdraw or deposit', async () => {
    const user = await inMemoryUsersRepository.findByEmail("Usuario@email.com.br")

    if (user?.id) {
      const depositStatement: ICreateStatementDTO = {
        user_id: user.id,
        amount: 1550,
        description: "Description test",
        type: "deposit" as OperationType,
      }
      const createDepositStatement = await createStatementUseCase.execute(depositStatement)

      const withdrawStatement: ICreateStatementDTO = {
        user_id: user.id,
        amount: 550,
        description: "Description test",
        type: "withdraw" as OperationType,
      }

      const createWithdrawStatement = await createStatementUseCase.execute(withdrawStatement)

      if (createDepositStatement.id) {
        const depositStatementOperation = await getStatementOperationUseCase.execute({
          user_id: user.id, statement_id:
            createDepositStatement.id
        })

        if (createWithdrawStatement.id) {
          const withdrawStatementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id, statement_id:
              createWithdrawStatement.id
          })

          expect(depositStatementOperation).toHaveProperty('id')
          expect(withdrawStatementOperation).toHaveProperty('id')
        }

      }
    }
  })

  it('should not be able to get info about withdraw or deposit from a non existent user', async () => {
      await expect(
        getStatementOperationUseCase.execute({
          user_id: 'wrong-id', statement_id:
            'non-existent-statement'
        })
      ).rejects.toEqual(new GetStatementOperationError.UserNotFound)
  })

  it('should not be able to get info about withdraw or deposit from a non existent statement', async () => {
    const user = await inMemoryUsersRepository.findByEmail("Usuario@email.com.br")

    if (user?.id) {

      await expect(
        getStatementOperationUseCase.execute({
          user_id: user.id, statement_id:
            'non-existent-statement'
        })
      ).rejects.toEqual(new GetStatementOperationError.StatementNotFound)
    }

  })

})
