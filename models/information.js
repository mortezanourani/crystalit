const ACCOUNTS = require('../middlewares/mongoContext').Account;

class Information {
  constructor({ firstName, lastName, birthDate, phoneNumbers }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.phoneNumbers = phoneNumbers || [];
    if (typeof phoneNumbers === 'string')
      this.phoneNumbers = [phoneNumbers];
  }

  static async findByUserId(userId) {
    if (!userId)
      userId = this._context.userId;
    let account = await ACCOUNTS.findOne({ _id: userId });
    if (!account.personalInfo)
      return new Information({});
    return new Information(account.personalInfo);
  }

  async update() {
    this.phoneNumbers = this.phoneNumbers
      .filter((phonenumber) => {
        return phonenumber != '';
      });
    let result = await ACCOUNTS.updateOne(
      { _id: this._context.userId },
      {
        $set: {
          personalInfo: {
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            phoneNumbers: this.phoneNumbers,
          }
        },
      }
    );
    return result.acknowledged;
  }
}

module.exports = Information;