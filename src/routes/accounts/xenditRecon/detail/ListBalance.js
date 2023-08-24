import moment from 'moment'
import { Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListBalance = ({ onClickJournal, onChangePagination, ...tableProps }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      render: value => <div style={{ textAlign: 'center' }}>{moment(value, 'YYYY-MM-DD').format('DD MMM YYYY')}</div>
    },
    {
      title: 'Invoice No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (value, record) => {
        return (
          <a href={`/journal-entry/${record.journalId}`} target="_blank">{value}</a>
        )
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
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

export default ListBalance
