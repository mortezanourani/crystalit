class Information {
  firstName = new String();
  lastName = new String();
  birthDate = new Date(0);
  phoneNumbers = new Array(new Number());

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.phoneNumbers = new Array(0);
  }
}

module.exports = () => Information;