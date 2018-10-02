import { formatNumberInExcel, formatNumberIndonesia } from '../numberFormat'

it('Should formatNumberInExcel return number with rupiah', () => {
  expect(formatNumberInExcel(2000, 1)).toEqual('#,##0.0')
})

it('Should formatNumberInExcel return error', () => {
  expect(formatNumberInExcel(2000, -1)).toEqual(new Error('cannot accept underzero'))
})

it('Should formatNumberInExcel return number with rupiah string', () => {
  expect(formatNumberInExcel('2000', 1)).toEqual('General')
})

it('Should formatNumberInExcel return dash with null', () => {
  expect(formatNumberInExcel(null)).toEqual('General')
})

it('Should return number with rupiah', () => {
  expect(formatNumberIndonesia(2000)).toEqual('2,000.00')
})

it('Should return number with rupiah string', () => {
  expect(formatNumberIndonesia('2000')).toEqual('2,000.00')
})

it('Should return dash with null', () => {
  expect(formatNumberIndonesia(null)).toEqual('-')
})
