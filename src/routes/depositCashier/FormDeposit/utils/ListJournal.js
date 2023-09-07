import { Col, Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListJournal = ({
  ...tableProps
}) => {
  const { dataSource } = tableProps

  const columns = [
    {
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Debit',
      dataIndex: 'amountIn',
      key: 'amountIn',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Credit',
      dataIndex: 'amountOut',
      key: 'amountOut',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
      footer={() => {
        const totalDebit = dataSource.reduce((prev, curr) => { return prev + curr.amountIn }, 0)
        const totalCredit = dataSource.reduce((prev, curr) => { return prev + curr.amountOut }, 0)
        return (
          <div style={{ maxWidth: '150px' }}>
            <Row type="flex">
              <Col style={{ flex: 1 }}>
                Debit
              </Col>
              <Col>
                {currencyFormatter(totalDebit)}
              </Col>
            </Row>
            <Row type="flex">
              <Col style={{ flex: 1 }}>
                Credit
              </Col>
              <Col>
                {currencyFormatter(totalCredit)}
              </Col>
            </Row>
          </div>
        )
      }}
    />
  )
}

export default ListJournal
