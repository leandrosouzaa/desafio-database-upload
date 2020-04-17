import path from 'path';
import csv from 'csvtojson';
import CreateTransactionService from './CreateTransactionService';

import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const filePath = path.join(uploadConfig.directory, fileName);

    const json = await csv().fromFile(filePath);
    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < json.length; i += 1) {
      const { title, type, value, category } = json[i];

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransaction.execute({
        title,
        type,
        value,
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
