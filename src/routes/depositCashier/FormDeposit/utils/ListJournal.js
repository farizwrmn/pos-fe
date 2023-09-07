import { Col, Modal, Row, Table } from 'antd'
import { DropOption } from 'components'
import { currencyFormatter } from 'utils/string'

const ListJournal = ({
  onDelete,
  onEdit,
  ...tableProps
}) => {
  const { dataSource } = tableProps

  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEdit(record)
    }

    if (e.key === '2') {
      Modal.confirm({
        title: 'Remove Item',
        content: 'Are you sure to remove this item?',
        onOk: () => {
          onDelete(record)
        }
      })
    }
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id'
    },
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
    },
    {
      title: 'action',
      render: (_, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
              type="primary"
              menuOptions={[
                { key: '1', name: 'Edit', icon: 'edit' },
                { key: '2', name: 'Delete', icon: 'close', disabled: false }
              ]}
            />
          </div>
        )
      }
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
