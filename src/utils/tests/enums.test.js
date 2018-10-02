import { EnumRoleType } from '../enums'

it('Should render EnumRoleType test', () => {
  expect(EnumRoleType).toEqual({
    LVL0: 'OWN',
    IT: 'IT'
  })
})
