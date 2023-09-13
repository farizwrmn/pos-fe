import { Row, Table } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const ListBalance = ({
  loading,
  balanceDepositInfo,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      render: (value, record) => <a href={`/setoran/cashier/balance/${record.balanceId}`} target="_blank">{value}</a>
    },
    {
      title: 'cashierName',
      dataIndex: 'cashierName',
      key: 'cashierName'
    },
    {
      title: 'Open-Closed Time',
      render: (_, record) => {
        return (
          <div>{`${moment(record.open).format('DD MMM YYYY, HH:mm:ss')} - ${moment(record.closed).format('DD MMM YYYY, HH:mm:ss')}`}</div>
        )
      }
    },
    {
      title: 'Total Penjualan',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Total Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    }
  ]

  return (
    <div>
      <Row>
        <h3
          style={{ fontWeight: 'bold' }}
        >
          {`List Balance [${moment.utc(balanceDepositInfo.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY')} - ${moment.utc(balanceDepositInfo.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}]`}
        </h3>
      </Row>
      <Row>
        <Table
          {...tableProps}
          columns={columns}
          bordered
          loading={loading.effects['depositCashier/queryBalanceDepositDetail']}
          pagination={{
            pageSize: 10
          }}
        />
      </Row>
    </div>
  )
}

export default ListBalance
