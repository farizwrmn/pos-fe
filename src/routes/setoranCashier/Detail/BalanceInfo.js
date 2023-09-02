import moment from 'moment'

const BalanceInfo = ({
  balanceInfo
}) => {
  return (
    <div>
      <div>
        <strong>Username: </strong>
        {balanceInfo.userName}
      </div>
      <div>
        <strong>Cashier Name: </strong>
        {balanceInfo.cashierName}
      </div>
      <div>
        <strong>Open Time: </strong>
        {moment(balanceInfo.open).format('DD MMM YYYY, HH:mm:ss')} - {moment(balanceInfo.closed).format('DD MMM YYYY, HH:mm:ss')}
      </div>
    </div>
  )
}

export default BalanceInfo
