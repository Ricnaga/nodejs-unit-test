import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, sender_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if (sender_id) {
      const sender_user = await this.usersRepository.findById(sender_id);

      if (!sender_user) {
        throw new CreateStatementError.UserNotFound();
      }

      const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }

      const statementOperation = await this.statementsRepository.create({
        user_id,
        sender_id,
        type,
        amount,
        description
      });

      return statementOperation;

    }

    if (type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}


//sender = eu
// user_id = destinatário
// {
//   "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
// 	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
//   "amount": 100,
//   "description": "Transferência de valor",
//   "type": "transfer",
//   "created_at": "2021-03-26T21:33:11.370Z",
//   "updated_at": "2021-03-26T21:33:11.370Z"
// }
