import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (req, res) => {
  const transacionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transacionsRepository.find({
    relations: ['category'],
    select: ['id', 'title', 'type', 'value', 'updated_at', 'created_at'],
  });
  const balance = await transacionsRepository.getBalance();

  return res.json({ transactions, balance });
});

transactionsRouter.post('/', async (req, res) => {
  const { title, value, type, category } = req.body;
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return res.json(transaction);
});

transactionsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return res.sendStatus(204);
});

transactionsRouter.post('/import', upload.single('file'), async (req, res) => {
  const importTransactionsService = new ImportTransactionsService();

  const transactions = await importTransactionsService.execute(
    req.file.filename,
  );

  return res.json(transactions);
});

export default transactionsRouter;
