import {
  SALESPAY,
  PPAY,
  EXPENSE,
  DEPOSITE,
  JOURNALENTRY
} from './variable'

export const getLink = (dispatch, { transactionId, storeId, transactionType }) => {
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
    case EXPENSE:
      dispatch({
        type: 'bankentry/linkCashEntry',
        payload: {
          id: transactionId,
          storeId
        }
      })
      break
    case DEPOSITE:
      dispatch({
        type: 'bankentry/linkBankEntry',
        payload: {
          id: transactionId,
          storeId
        }
      })
      break
    case JOURNALENTRY:
      dispatch({
        type: 'bankentry/linkJournalEntry',
        payload: {
          id: transactionId,
          storeId
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
    case EXPENSE:
      return 'Expense Entry'
    case DEPOSITE:
      return 'Deposit Entry'
    case JOURNALENTRY:
      return 'Journal Entry'
    default:
      return transactionType
  }
}
