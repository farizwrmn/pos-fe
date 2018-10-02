import { compareExistsById, compareExistsByIdAndQty, compareBundleExists, compareBundleItemExists } from '../compare'

it('Should render compare as true and productId', () => {
  const subject = [
    {
      productId: '1'
    }
  ]
  const target = [
    {
      productId: '1'
    }
  ]
  expect(compareExistsById(subject, target)).toEqual({ status: true, data: { productId: '1' } })
})

it('Should render compare subject is null', () => {
  const subject = null
  const target = null
  expect(compareExistsById(subject, target)).toEqual({ status: false })
})

it('Should render compare target is not null', () => {
  const subject = null
  const target = [
    {
      productId: '3'
    }
  ]
  expect(compareExistsById(subject, target)).toEqual({ status: false })
})

it('Should render compare as false', () => {
  const subject = [
    {
      productId: '1'
    },
    {
      productId: '2'
    }
  ]
  const target = [
    {
      productId: '3'
    }
  ]
  expect(compareExistsById(subject, target)).toEqual({ status: false })
})


it('Should render compare by qty as false where qty is equal', () => {
  const subject = [
    {
      productId: '1',
      qty: 1,
      bundleId: 1
    },
    {
      productId: '2',
      qty: 1,
      bundleId: 1
    }
  ]
  const target = [
    {
      productId: '3',
      qty: 1,
      bundleId: 1
    }
  ]
  expect(compareExistsByIdAndQty(subject, target)).toEqual({ status: false })
})

it('Should render compare by qty as false where qty is bigger', () => {
  const subject = [
    {
      productId: '1',
      qty: 1,
      bundleId: 1
    },
    {
      productId: '2',
      qty: 1,
      bundleId: 1
    }
  ]
  const target = [
    {
      productId: '1',
      qty: 2,
      bundleId: 1
    }
  ]
  expect(compareExistsByIdAndQty(subject, target)).toEqual({ status: false })
})

it('Should render compare by qty as false where qty is bigger and bundleId is null', () => {
  const subject = [
    {
      productId: '1',
      qty: 1,
      bundleId: null
    },
    {
      productId: '2',
      qty: 1,
      bundleId: null
    }
  ]
  const target = [
    {
      productId: '1',
      qty: 2,
      bundleId: 1
    }
  ]
  expect(compareExistsByIdAndQty(subject, target)).toEqual({ status: false })
})

it('Should render compare qty subject is null', () => {
  const subject = null
  const target = null
  expect(compareExistsByIdAndQty(subject, target)).toEqual({ status: true })
})

it('Should render compare qty target is not null', () => {
  const subject = null
  const target = [
    {
      productId: '3'
    }
  ]
  expect(compareExistsByIdAndQty(subject, target)).toEqual({ status: false })
})


it('Should render compare by qty as true where qty is bigger and bundleId is null', () => {
  const subject = [
    {
      productId: '1',
      qty: 1,
      bundleId: null
    }
  ]
  const target = [
    {
      productId: '1',
      qty: 1,
      bundleId: null
    }
  ]
  expect(compareExistsByIdAndQty(subject, target)).toEqual({ status: true })
})

it('For test bundle exists', () => {
  const subject = [
    {
      bundleId: '1'
    }
  ]
  const target = {
    id: '1'
  }

  expect(compareBundleExists(subject, target)).toEqual({
    data: [{
      bundleId: '1'
    }],
    status: true
  })
})

it('For test bundle not exists', () => {
  const subject = [
    {
      bundleId: '1'
    }
  ]
  const target = {
    id: '3'
  }

  expect(compareBundleExists(subject, target)).toEqual({
    data: [],
    status: false
  })
})

it('For test bundle is null', () => {
  const subject = null
  const target = {
    id: '3'
  }

  expect(compareBundleExists(subject, target)).toEqual({
    data: [],
    status: false
  })
})

it('For test bundle item not exists', () => {
  const subject = [
    {
      bundleId: '1',
      productId: '1'
    }
  ]
  const target = [
    {
      productId: '1',
      bundleId: '1'
    }
  ]
  expect(compareBundleItemExists(subject, target)).toEqual({
    data: [{
      bundleId: '1',
      productId: '1'
    }],
    status: true
  })
})

it('For test bundle is null ', () => {
  const subject = null
  const target = [
    {
      bundleId: '1',
      productId: '1'
    }
  ]
  expect(compareBundleItemExists(subject, target)).toEqual({
    status: false
  })
})

it('For test bundle item null', () => {
  const subject = null
  const target = null
  expect(compareBundleItemExists(subject, target)).toEqual({ status: false })
})

it('For test bundle item exists', () => {
  const subject = [
    {
      bundleId: '1',
      productId: '1'
    }
  ]
  const target = [
    {
      bundleId: '1',
      productId: '1'
    }
  ]

  expect(compareBundleItemExists(subject, target)).toEqual({
    data: [{
      bundleId: '1',
      productId: '1'
    }],
    status: true
  })
})
