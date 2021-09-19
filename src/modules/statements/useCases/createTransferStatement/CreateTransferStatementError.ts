import { AppError } from "../../../../shared/errors/AppError";

export class CreateTransferStatementError extends AppError {
  constructor() {
    super('Amount bigger than balance', 403);
  }
}
