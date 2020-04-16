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
    const transactionsIncome = await getRepository(Transaction)
      .createQueryBuilder('transactions')
      .select('SUM(transactions.value)', 'sum')
      .where('transactions.type = :type', { type: 'income' })
      .getRawOne();
    console.log(transactionsIncome);
  }
}

export default TransactionsRepository;
