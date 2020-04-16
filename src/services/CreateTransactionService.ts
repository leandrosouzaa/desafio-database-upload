import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  category: string;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    category,
    type,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);

    const checkCategoryExist = await categoryRepository.findOne({
      where: { category },
    });

    if (!checkCategoryExist) {
      const newcategory = await categoryRepository.create({ title: category });
      await categoryRepository.save(newcategory);

      const transaction = await transactionRepository.create({
        title,
        value,
        category_id: newcategory.id,
        type,
      });

      await transactionRepository.save(transaction);

      return transaction;
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category_id: checkCategoryExist.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
