import { Button, Col, Table } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const ListBalance = ({
  handleChangePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      render: (value, record) => {
        return <a href={`/setoran/cashier/detail/${record.balanceId}`} target="_blank">{value}</a>
      }
    },
    {
      title: 'Cashier Name',
      dataIndex: 'cashierName',
      key: 'cashierName'
    },
    {
      title: 'Open-Closed Time',
      render: (_, record) => <div>{moment(record.open).format('DD MMM YYYY, HH:mm:ss')} - {moment(record.closed).format('DD MMM YYYY, HH:mm:ss')}</div>
    },
    {
      title: 'Total Balance Payment',
      dataIndex: 'totalBalancePayment',
      key: 'totalBalancePayment',
      render: value => <div style={{ textAlign: 'right' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Total Selisih',
      dataIndex: 'totalDiffBalance',
      key: 'totalDiffBalance',
      render: value => <div style={{ textAlign: 'right' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Journal Invoice',
      dataIndex: 'journalInvoice',
      key: 'journalInvoice',
      render: (value) => {
        if (!value) {
          return (
            <div style={{ textAlign: 'center' }}>
              <Button type="primary">
                Create Journal
              </Button>
            </div>
          )
        }

        return (
          <div style={{ textAlign: 'center' }}>{value}</div>
        )
      }
    }
  ]

  return (
    <Col>
      <h3 style={{ fontWeight: 'bold' }}>
        List Detail
      </h3>
      <Table
        {...tableProps}
        columns={columns}
        bordered
        onChange={handleChangePagination}
      />
    </Col>
  )
}

export default ListBalance
