import { EntityRepository, Repository } from 'typeorm';
// import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // const categoryRepository = getRepository(Category);
    // const transactionRepository = getRepository(Transaction);

    const { income, outcome } = await (await this.find()).reduce(
      (acc: Balance, transaction: Transaction) => {
        // eslint-disable-next-line no-unused-expressions
        transaction.type === 'income'
          ? (acc.income += transaction.value)
          : (acc.outcome += transaction.value);

        return acc;
      },

      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
