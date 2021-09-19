import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";

export class CreateTransferStatementController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { user_id: recipient_id } = request.params
    const { amount, description } = request.body

    const createTransferStatementUseCase = container.resolve(CreateTransferStatementUseCase)
    await createTransferStatementUseCase.execute({ sender_id, recipient_id, amount, description })
    return response.send()
  }
}