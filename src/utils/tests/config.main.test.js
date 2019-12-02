import {
  name,
  version,
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

it('Should render App Version', () =>
  expect(version).toEqual('2018.07.003')
)

it('Should render App Prefix', () =>
  expect(prefix).toEqual('dmiPos')
)

it('Should render App footerText', () =>
  expect(footerText).toEqual('Smartech Indo')
)

it('Should render App footerSubText', () =>
  expect(footerSubText).toEqual('Point of Sales © 2017-2018')
)

it('Should render App Logo String', () =>
  expect(logo).toEqual('/logo.png')
)

it('Should render App openPages', () =>
  expect(openPages).toEqual(['/login', '/nps/01', '/nps/02', '/nps/03'])
)

it('Should render App MultiSelect', () =>
  expect(disableMultiSelect).toEqual(true)
)
