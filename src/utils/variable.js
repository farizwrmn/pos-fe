// Request transactionType
export const CANCEL_ITEM = 'CANCEL_ITEM'
export const CANCEL_INPUT = 'CANCEL_INPUT'
export const DISCOUNT_ITEM = 'DISCOUNT_ITEM'
export const CANCEL_INVOICE = 'CANCEL_INVOICE'

// balanceType
export const BALANCE_TYPE_AWAL = 0
export const BALANCE_TYPE_CLOSING = 1
export const BALANCE_TYPE_TRANSACTION = 2
export const BALANCE_TYPE_CONSIGNMENT = 4
export const BALANCE_TYPE_COMPARE = 3

// CACHE TYPE
export const CACHE_TYPE_ADJUST = 'adjust'
export const CACHE_TYPE_ALL = 'all'
export const CACHE_TYPE_BANK = 'bank'
export const CACHE_TYPE_CASH_ENTRY_EXPENSE = 'cashEntryExpense'
export const CACHE_TYPE_PETTY_CASH = 'pettyCash'
export const CACHE_TYPE_PETTY_CASH_EXPENSE = 'pettyCashExpense'
export const CACHE_TYPE_BANK_ENTRY = 'bankEntry'
export const CACHE_TYPE_VOUCHER = 'marketingVoucher'
export const CACHE_TYPE_PAYABLE_FORM = 'payableForm'
export const CACHE_TYPE_PAYABLE_FORM_EXPENSE = 'payableFormExpense'
export const CACHE_TYPE_MARKETING_VOUCHER_DETAIL = 'marketingVoucherDetail'
export const CACHE_TYPE_TRANSFER_INVOICE = 'transferInvoice'
export const CACHE_TYPE_MASTER_ACCOUNT = 'masterAccount'

// ACCOUNT TYPE
export const ACCOUNT_TYPE_ADJUST = [
  'REVE',
  'OINC',
  'EXPS',
  'OEXP',
  'EQTY',
  'COGS',
  'AREC'
]
export const ACCOUNT_TYPE_PETTY_CASH = [
  'BANK',
  'COGS',
  'EXPS',
  'AREC',
  'OEXP'
]

export const ACCOUNT_TYPE_BANK = [
  'BANK'
]

export const ACCOUNT_TYPE_PETTY_CASH_EXPENSE = [
  'COGS',
  'EXPS',
  'AREC',
  'OEXP'
]

export const ACCOUNT_TYPE_VOUCHER_PAYMENT = [
  'OCAS',
  'AREC',
  'FASS',
  'OASS',
  'EXPS',
  'OEXP',
  'BANK'
]

export const ACCOUNT_TYPE_VOUCHER = [
  'OCAS',
  'AREC',
  'FASS',
  'OASS',
  'EXPS',
  'OEXP',
  'REVE',
  'OINC'
]

// type
export const TYPE_SALES = 0
export const TYPE_PETTY_CASH = 1
export const TYPE_CONSIGNMENT = 2

// NOTIFICATION
export const HELP_NOTIFICATION_COPY = 'Copy endpoint to your fingerprint driver'
export const HELP_NOTIFICATION_ERROR = 'Endpoint is not found, please refresh'

// CONSIGNMENT TYPE PEMBELIAN
export const TYPE_PEMBELIAN_UMUM = 1
export const TYPE_PEMBELIAN_GRABFOOD = 2
export const TYPE_PEMBELIAN_DINEIN = 3
export const TYPE_PEMBELIAN_GRABMART = 4

// ACCOUNTING TRANSACTION TYPE
export const SALES = 'SALES'
export const JOURNALENTRY = 'JREN'
export const EXPENSE = 'CASHE'
export const DEPOSITE = 'BANKE'
export const TRANSFERINVOICE = 'TINV'
export const SALESPAY = 'SPAY'
export const PURCHASE = 'PURC'
export const MUOUT = 'MUOUT'
export const MUIN = 'MUIN'
export const PPAY = 'PPAY'
export const PPAYHEADER = 'PPAYH'
export const AJIN = 'AJIN'
export const AJOUT = 'AJOUT'
export const RBB = 'RBB'
export const RJJ = 'RJJ'
export const VOUCHER = 'VOUC'

export const VOUCHER_STORE_ID = 1
