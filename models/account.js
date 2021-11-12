class Account {
  username = new String();
  passwordHash = new String();
  role = new String();
  personalInfo = new Information();
  addresses = new Array(new Address());
  verified = new Boolean();
}

class Role {
  name = new String();
  title = new String();
}

const administrator = new Role();
administrator.name = 'Administrator';
administrator.title = 'مدیر';

const manager = new Role();
manager.name = 'Manager';
manager.title = 'متصدی';

const user = new Role();
user.name = 'User';
user.title = 'مشتری';

const AccountRole = {
  Administrator: administrator,
  Manager: manager,
  User: user,
};

class Information {
  firstName = new String();
  lastName = new String();
  birthDate = new Date(0);
  phoneNumbers = new Array(new Number());
}

class Address {
  address = new String();
  street = new String();
  city = new String();
  province = new String();
  postalCode = new Number();
}

module.exports = {
  Account,
  AccountRole,
  Information,
  Address,
};
