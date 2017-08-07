const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '1',
    icon: 'laptop',
    name: 'Dashboard',
    route: '/dashboard',
  },
  {
    id: '2',
    icon: 'camera-o',
    name: 'Master',
  },
  {
    id: '21',
    bpid: '2',
    mpid: '2',
    name: 'Employees',
    icon: 'idcard',
    route: '/master/employee',
  },
  {
    id: '211',
    mpid: '-1',
    bpid: '21',
    name: 'Employee Detail',
    route: '/master/employee/:id',
  },
  {
    id: '22',
    bpid: '2',
    mpid: '2',
    name: 'Customers',
    icon: 'team',
  },
  {
    id: '221',
    bpid: '22',
    mpid: '22',
    name: 'Customer List',
    icon: 'solution',
    route: '/master/customer',
  },
  {
    id: '222',
    bpid: '22',
    mpid: '22',
    name: 'Customer Group',
    icon: 'usergroup-add',
    route: '/master/customergroup'
  },
  {
    id: '223',
    bpid: '22',
    mpid: '22',
    name: 'Customer Type',
    icon: 'usergroup-add',
    route: '/master/customertype'
  },
  {
    id: '23',
    bpid: '2',
    mpid: '2',
    name: 'Suppliers',
    icon: 'share-alt',
    route: '/master/suppliers',
  },
  {
    id: '24',
    bpid: '2',
    mpid: '2',
    name: 'Product',
    icon: 'appstore-o',
    route: '/master/product',
  },
  {
    id: '241',
    bpid: '24',
    mpid: '24',
    name: 'Brand',
    icon: 'windows-o',
    route: '/master/product/brand',
  },
  {
    id: '242',
    bpid: '24',
    mpid: '24',
    name: 'Category',
    icon: 'windows',
    route: '/master/product/category',
  },
  {
    id: '243',
    bpid: '24',
    mpid: '24',
    name: 'Stock',
    icon: 'shop',
    route: '/master/product/stock',
  },
  {
    id: '25',
    bpid: '2',
    mpid: '2',
    icon: 'tool',
    name: 'Service',
    route: '/master/service',
  },
  {
    id: '26',
    bpid: '2',
    mpid: '2',
    icon: 'environment',
    name: 'City',
    route: '/master/city',
  },
  {
    id: '3',
    icon: 'code-o',
    name: 'Transaction',
  },
  {
    id: '31',
    bpid: '3',
    mpid: '3',
    name: 'POS',
    icon: 'barcode',
    route: '/transaction/pos',
  },
  {
    id: '32',
    bpid: '3',
    mpid: '3',
    name: 'Purchase',
    icon: 'shopping-cart',
    route: '/transaction/purchase',
  },
  {
    id: '9',
    icon: 'setting',
    name: 'Setting',
  },
  {
    id: '91',
    bpid: '9',
    mpid: '9',
    name: 'Personnel',
    icon: 'user',
  },
  {
    id: '911',
    bpid: '91',
    mpid: '91',
    name: 'Users',
    icon: 'user-add',
    route: '/setting/user',
  },
  {
    id: '9111',
    bpid: '911',
    mpid: '-1',
    name: 'User Detail',
    route: '/setting/user/:id',
  },
  {
    id: '912',
    mpid: '91',
    bpid: '91',
    name: 'Cashier Transaction',
    icon: 'customer-service',
    route: '/setting/cashier',
  },
  {
    id: '92',
    bpid: '9',
    mpid: '9',
    name: 'Misc',
    icon: 'star-o',
    route: '/setting/misc',
  },
  {
    id: '921',
    mpid: '-1',
    bpid: '92',
    name: 'Misc Detail',
    route: '/setting/misc/:id',
  }
]

module.exports = {

  [`GET ${apiPrefix}/menus`] (req, res) {
    res.status(200).json(database)
  },
}
