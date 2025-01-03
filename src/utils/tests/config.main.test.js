import moment from 'moment'
import {
  name,
  prefix,
  footerText,
  footerSubText,
  openPages,
  disableMultiSelect
} from '../config.main'

it('Should render App name', () =>
  expect(name).toEqual('www.k3mart.id')
)

it('Should render App Prefix', () =>
  expect(prefix).toEqual('smiPos')
)

it('Should render App footerText', () =>
  expect(footerText).toEqual('K3MART')
)

it('Should render App footerSubText', () =>
  expect(footerSubText).toEqual(`K3MART © ${moment().format('YYYY')}`)
)

it('Should render App openPages', () =>
  expect(openPages).toEqual(
    [
      '/login',
      '/nps/01',
      '/nps/02',
      '/nps/03',
      '/transaction/pos/customer-view',
      '/transaction/pos/admin-invoice/:id',
      '/transaction/pos/invoice/:id',
      '/balance/invoice/:id'
      // 'print-barcode'
    ])
)

it('Should render App MultiSelect', () =>
  expect(disableMultiSelect).toEqual(true)
)
