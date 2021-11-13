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

module.exports = AccountRole;