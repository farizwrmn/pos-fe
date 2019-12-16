import {
  name,
  prefix,
  footerText,
  footerSubText,
  logo,
  openPages,
  disableMultiSelect
} from '../config.main'

it('Should render App name', () =>
  expect(name).toEqual('Stock-POS')
)

it('Should render App Prefix', () =>
  expect(prefix).toEqual('smiPos')
)

it('Should render App footerText', () =>
  expect(footerText).toEqual('Smartech Indo')
)

it('Should render App footerSubText', () =>
  expect(footerSubText).toEqual('Point of Sales © 2019')
)

it('Should render App Logo String', () =>
  expect(logo).toEqual('/logo.png')
)

it('Should render App openPages', () =>
  expect(openPages).toEqual(['/login', '/nps/01', '/nps/02', '/nps/03', '/transaction/pos/customer-view'])
)

it('Should render App MultiSelect', () =>
  expect(disableMultiSelect).toEqual(true)
)
