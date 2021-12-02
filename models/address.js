class Address {
  address = new String('');
  street = new String('');
  city = new String('');
  province = new String('');
  postalCode = new Number(0);

  constructor() {
    this.address = '';
    this.street = '';
    this.city = '';
    this.province = '';
    this.postalCode = 0;
  }
}

module.exports = () => Address;