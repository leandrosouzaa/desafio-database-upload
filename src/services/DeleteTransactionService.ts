import { isUuid } from 'uuidv4';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    if (!isUuid(id)) {
      throw new AppError('Invalid ID', 400);
    }

    const transaction = await transactionRepository.find({ where: { id } });

    if (!transaction) {
      throw new AppError('Invalid ID', 400);
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
