export namespace App {
  export type Currency = 'AUD' | 'NZD';
  class User {
    private name: string;

    constructor(name: string) {
      this.name = name;
    }

    public getName() {
      return this.name;
    }
  }

  class UserRepository {
    constructor() {}

    public findByName(name: string) {
      return new User(name);
    }
  }

  export class Payment {
    private payer: User;
    private payee: User;
    private cents: number;
    private currency: Currency;

    constructor(payer: User, payee: User, cents: number, currency: Currency) {
      this.payer = payer;
      this.payee = payee;
      this.cents = cents;
      this.currency = currency;
    }

    public getPayer(): User {
      return this.payer;
    }

    public getPayee(): User {
      return this.payee;
    }

    public getCents(): number {
      return this.cents;
    }

    public getCurrency(): Currency {
      return this.currency;
    }
  }

  export class PaymentLedger {
    private ledger: Payment[] = [];

    constructor(dBConnection: Library.DBConnection) {}

    public lodge(payment: Payment) {
      this.ledger.push(payment);
    }

    public getPayment(paymentNumber: number): Payment {
      return this.ledger[paymentNumber];
    }
  }

  export class PaymentGateway {
    private dbConnection: Library.DBConnection;
    private repository: UserRepository;
    public ledger: PaymentLedger;

    /**
     * This hard-coded initialization inside the constructor is the issue we're trying to solve
     *
     * @memberof PaymentGateway
     */
    constructor() {
      this.dbConnection = new Library.DBConnection();
      this.repository = new UserRepository();
      this.ledger = new PaymentLedger(this.dbConnection);
    }

    public createPayment(
      fromName: string,
      toName: string,
      cents: number,
      currency: Currency
    ): Payment {
      const fromUser = this.repository.findByName(fromName);
      const toUser = this.repository.findByName(toName);
      return new Payment(fromUser, toUser, cents, currency);
    }

    /**
     * Challenge:
     * - Add a currency argument to this method with an appropriate test.
     * - Do not use the UserRepository or PaymentLedger to test this class (that would
     *   take far too long to setup!!)
     * - The currency in use before this change was AUD.
     *
     * @param {string} fromName
     * @param {string} toName
     * @param {number} cents
     * @memberof PaymentGateway
     */
    public makePayment(
      fromName: string,
      toName: string,
      cents: number,
      currency: Currency
    ): void {
      this.ledger.lodge(this.createPayment(fromName, toName, cents, currency));
    }
  }
}

namespace Library {
  export class DBConnection {
    public executeCommand(query: string): void {
      // ...
    }
    public executeQuery(query: string): any[] {
      // ...
      return [];
    }
  }
}
