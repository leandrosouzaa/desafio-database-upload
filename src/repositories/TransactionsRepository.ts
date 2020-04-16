import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);

    const inTransactions = await transactionRepository.find({
      where: { type: 'income' },
    });
    const income = inTransactions.reduce((total, t) => total + t.value, 0);

    const outTransactions = await transactionRepository.find({
      where: { type: 'outcome' },
    });
    const outcome = outTransactions.reduce((total, t) => total + t.value, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
