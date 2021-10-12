import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../entities/Statement';

import { CreateStatementUseCase } from './CreateStatementUseCase';

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    if (type !== 'deposit' && type !== 'withdraw') {
      const { id: sender_id } = request.user;
      const { user_id } = request.params;

      const statement = await createStatement.execute({
        sender_id,
        user_id,
        type: OperationType.TRANSFER,
        amount,
        description
      });

      return response.status(201).json(statement);
    }

    const { id: user_id } = request.user;

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
