import { dayByNumber } from '../calendar'

it('Should render Monday', () => {
  expect(dayByNumber('1')).toEqual('Monday')
})

it('Should render Tuesday', () => {
  expect(dayByNumber('2')).toEqual('Tuesday')
})

it('Should render Wednesday', () => {
  expect(dayByNumber('3')).toEqual('Wednesday')
})

it('Should render Thursday', () => {
  expect(dayByNumber('4')).toEqual('Thursday')
})

it('Should render Friday', () => {
  expect(dayByNumber('5')).toEqual('Friday')
})

it('Should render Saturday', () => {
  expect(dayByNumber('6')).toEqual('Saturday')
})

it('Should render Sunday', () => {
  expect(dayByNumber('7')).toEqual('Sunday')
})

it('Should render Null if given null', () => {
  expect(dayByNumber(null)).toEqual(null)
})

it('Should render Null if given out of topic', () => {
  expect(dayByNumber()).toEqual(null)
})

