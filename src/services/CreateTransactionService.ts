import { getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

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

    let categoryData = await categoryRepository.findOne({
      where: { category },
    });

    if (!categoryData) {
      categoryData = await categoryRepository.create({ title: category });
      await categoryRepository.save(categoryData);
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryData.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
