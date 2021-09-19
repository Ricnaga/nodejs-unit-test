import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferStatementError } from "./CreateTransferStatementError";

interface IRequest {
  amount: number;
  description: string;
  sender_id: string;
  recipient_id: string;
}

@injectable()
export class CreateTransferStatementUseCase {

  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ sender_id, recipient_id, amount, description }: IRequest): Promise<void> {
    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (amount > balance) {
      throw new CreateTransferStatementError()
    }
  }

}
