import {
  SALESPAY,
  PPAY
} from './variable'

export const getLink = (dispatch, { transactionId, transactionType }) => {
  switch (transactionType) {
    case SALESPAY:
      dispatch({
        type: 'bankentry/linkSales',
        payload: {
          id: transactionId
        }
      })
      break
    case PPAY:
      dispatch({
        type: 'bankentry/linkPurchase',
        payload: {
          id: transactionId
        }
      })
      break
    default:
      break
  }
}

export const getName = (transactionType) => {
  switch (transactionType) {
    case SALESPAY:
      return 'Sales Payment'
    case PPAY:
      return 'Purchase Payment'
    default:
      break
  }
}
