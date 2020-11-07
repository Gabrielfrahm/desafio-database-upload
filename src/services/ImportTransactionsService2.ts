import csvParse from 'csv-parse';
import fs from 'fs';

import { getCustomRepository, getRepository, In } from 'typeorm';

import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService2 {
  async execute(filePath: string): Promise<Transaction[]> {
    // array de transactions
    const transactions: CSVTransaction[] = [];
    // array de categories
    const categories: string[] = [];

    const categoriesRepositories = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionRepository);

    // const csvFilePath = path.resolve(
    //   uploadConfig.directory,
    //   'import_template.csv',
    // );
    const contactsReadSteam = fs.createReadStream(filePath);

    const parsers = csvParse({
      // pula linha do arquivo
      from_line: 2,
    });

    // para ler as linhas do arquivo
    const parseCSV = contactsReadSteam.pipe(parsers);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      // eslint-disable-next-line no-useless-return
      if (!title || !type || !value || !category) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    // esperou o evento ser emitido pelo parseCSV
    await new Promise(resolve => parseCSV.on('end', resolve));

    // procura no banco se ja temos essas categorias importadas, percorrendo o array do categories
    const existesCategories = await categoriesRepositories.find({
      where: { title: In(categories) },
    });

    // caso exista, ele procura apenas o nome daquela categoria para que possamos cadastrar no banco
    const existesCategoriesTitle = existesCategories.map(
      (category: Category) => category.title,
    );

    // nesse caso consigo pegar apenas as categorias que nao tenho no banco de dados
    const addCategoryTitle = categories
      .filter(category => !existesCategoriesTitle.includes(category))
      // aqui ele retira as duplicadas de categories assim pegamos apenas uma de cada tipo
      .filter((value, index, self) => self.indexOf(value) === index);

    // percorre o novo array de categories recebendo os valores de title corretos e cria um objeto para o banco de dados
    const newCategory = categoriesRepositories.create(
      addCategoryTitle.map(title => ({
        title,
      })),
    );

    // salva no banco
    await categoriesRepositories.save(newCategory);

    // todas as categories criadas, tanto as novas add no banco quando as que ja existem
    const finalCategories = [...newCategory, ...existesCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    return createdTransactions;
  }
}
export default ImportTransactionsService2;
