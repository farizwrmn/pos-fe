import moment from 'moment'
import { Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListTransaction = ({ onChangePagination, ...tableProps }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      render: value => <div style={{ textAlign: 'center' }}>{moment(value, 'YYYY-MM-DD').format('DD MMM YYYY')}</div>
    },
    {
      title: 'Invoice',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo'
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'MDR',
      dataIndex: 'mdrAmount',
      key: 'mdrAmount',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    }
  ]

  return (
    <Row>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        onChange={onChangePagination}
      />
    </Row>
  )
}

export default ListTransaction
