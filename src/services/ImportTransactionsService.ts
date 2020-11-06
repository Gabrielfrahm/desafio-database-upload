import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
// import { getCustomRepository, getRepository } from 'typeorm';

import uploadConfig from '../config/upload';

// import Category from '../models/Category';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
// import TransactionRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    // const transactionRepository = getCustomRepository(TransactionRepository);
    // const categoryRepository = getRepository(Category);
    const csvFilePath = path.resolve(
      uploadConfig.directory,
      'import_template.csv',
    );
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: any[] | PromiseLike<Transaction[]> = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    // const data = Promise.all(
    //   lines.map(async line => {
    // const info = {
    //   title: line[0],
    //   type: line[1],
    //   value: line[2],
    //   category: line[3],
    // };

    //     const [title, type, value, category] = line;

    //     return line;
    //   }),
    // );

    // eslint-disable-next-line no-restricted-syntax
    for (const data of lines) {
      const [title, type, value, category] = data;

      // eslint-disable-next-line no-await-in-loop
      await createTransaction.execute({
        title,
        type,
        value,
        category,
      });
    }

    return lines;
  }
}
export default ImportTransactionsService;
