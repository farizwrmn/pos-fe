import { Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListJournal = ({
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Journal Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (value, record) => <a href={`/journal-entry/${encodeURIComponent(record.journalId)}`} target="_blank">{value}</a>
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  return (
    <div>
      <Row>
        <h3 style={{ fontWeight: 'bold' }}>
          List Journal
        </h3>
      </Row>
      <Row>
        <Table
          {...tableProps}
          columns={columns}
          bordered
          pagination={{
            pageSize: 10
          }}
        />
      </Row>
    </div>
  )
}

export default ListJournal
