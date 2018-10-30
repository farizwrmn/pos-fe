import { posTotal } from '../total'

it('Should count pos total 0', () => {
  const data = {
    qty: 0,
    sellingPrice: 0,
    discount: 0,
    disc1: 0,
    disc2: 0,
    disc3: 0
  }
  expect(posTotal(data)).toEqual(0)
})

it('Should count pos total 10000', () => {
  const data = {
    qty: 1,
    sellingPrice: 10000,
    discount: 0,
    disc1: 0,
    disc2: 0,
    disc3: 0
  }
  expect(posTotal(data)).toEqual(10000)
})

it('Should count pos total 20000', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 0,
    disc1: 0,
    disc2: 0,
    disc3: 0
  }
  expect(posTotal(data)).toEqual(20000)
})

it('Should count pos total 20000-1000 = 19000', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 1000,
    disc1: 0,
    disc2: 0,
    disc3: 0
  }
  expect(posTotal(data)).toEqual(19000)
})

it('Should count pos total 20000 - 4000 -1000 = 15000', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 1000,
    disc1: 20,
    disc2: 0,
    disc3: 0
  }
  expect(posTotal(data)).toEqual(15000)
})

it('Should count pos total 20000 - 4000 - 1600 - 1000 = 13400', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 1000,
    disc1: 20,
    disc2: 10,
    disc3: 0
  }
  expect(posTotal(data)).toEqual(13400)
})

it('Should count pos total 20000 - 4000 - 1600 - 1340 - 1000 = 11960', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 1000,
    disc1: 20,
    disc2: 10,
    disc3: 10
  }
  expect(posTotal(data)).toEqual(11960)
})

// Test if null

it('Should throw error qty cannot be null', () => {
  const data = {
    qty: null,
    sellingPrice: 10000,
    discount: 1000,
    disc1: 20,
    disc2: 10,
    disc3: 10
  }
  expect(() => posTotal(data)).toThrow()
})

it('Should throw error sellingPrice cannot be null', () => {
  const data = {
    qty: 2,
    sellingPrice: null,
    discount: 1000,
    disc1: 20,
    disc2: 10,
    disc3: 10
  }
  expect(() => posTotal(data)).toThrow()
})

it('Should throw error discount cannot be null', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: null,
    disc1: 20,
    disc2: 10,
    disc3: 10
  }
  expect(() => posTotal(data)).toThrow()
})

it('Should throw error disc1 cannot be null', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 1000,
    disc1: null,
    disc2: 10,
    disc3: 10
  }
  expect(() => posTotal(data)).toThrow()
})

it('Should throw error disc2 cannot be null', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 1000,
    disc1: 20,
    disc2: null,
    disc3: 10
  }
  expect(() => posTotal(data)).toThrow()
})

it('Should throw error disc3 cannot be null', () => {
  const data = {
    qty: 2,
    sellingPrice: 10000,
    discount: 1000,
    disc1: 20,
    disc2: 10,
    disc3: null
  }
  expect(() => posTotal(data)).toThrow()
})
