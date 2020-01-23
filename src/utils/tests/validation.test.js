import {
  allowPrint
} from '../validation'

describe('Success allow print', () => {
  it('Should return true because not reach limit of print', () => {
    expect(allowPrint(0, 1)).toEqual(true)
  })
})

describe('Failed allow print', () => {
  it('Should return false because reach limit of print', () => {
    expect(allowPrint(1, 1)).toEqual(false)
  })

  it('Should return false because printNo is undefined', () => {
    expect(allowPrint(undefined, 1)).toEqual(false)
  })
  it('Should return false because printNo is null', () => {
    expect(allowPrint(undefined, 1)).toEqual(false)
  })
  it('Should return false because printLimit is undefined', () => {
    expect(allowPrint(0, undefined)).toEqual(false)
  })
  it('Should return false because printLimit is null', () => {
    expect(allowPrint(0, undefined)).toEqual(false)
  })

  it('Should return false because printNo is undefined', () => {
    expect(allowPrint(null, 1)).toEqual(false)
  })
  it('Should return false because printNo is null', () => {
    expect(allowPrint(null, 1)).toEqual(false)
  })
  it('Should return false because printLimit is undefined', () => {
    expect(allowPrint(0, null)).toEqual(false)
  })
  it('Should return false because printLimit is null', () => {
    expect(allowPrint(0, null)).toEqual(false)
  })
})
