import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

describe('Get Balance Use Case', () => {

  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository, inMemoryUsersRepository
    )

    await inMemoryUsersRepository.create({
      name: "Usuario teste",
      email: "Usuario@email.com.br",
      password: '123456'
    })

  })

  it('should be able to get balance an user', async () => {
    const user = await inMemoryUsersRepository.findByEmail("Usuario@email.com.br")

    if (user?.id) {
      const userBalance = await getBalanceUseCase.execute({ user_id: user.id })

      expect(userBalance).toHaveProperty('statement')
      expect(userBalance).toHaveProperty('balance')
    }
  })

  it('should not be able to get balance from a non existent user', async () => {
    await expect(
       getBalanceUseCase.execute({ user_id: 'non-existent-id' })
    ).rejects.toEqual(new GetBalanceError)
  })
})
