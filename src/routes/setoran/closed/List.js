import { Col, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const columnProps = {
  xs: 24,
  sm: 24,
  md: 16,
  lg: 12,
  xl: 12
}

const List = ({
  closedBalance,
  listOpts
}) => {
  const availableListPayment = ['C', 'V']
  const filteredPaymentOption = listOpts.filter(filtered => availableListPayment.find(item => item === filtered.typeCode))
  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    ...filteredPaymentOption.map((record) => {
      const currentClosedBalance = closedBalance.find(item => item.paymentOption === record.typeCode)
      return ({
        title: record.typeName,
        dataIndex: 'type',
        key: `type#${record.typeCode}`,
        render: (value) => {
          let amount = 0
          if (!currentClosedBalance) return <div style={{ textAlign: 'end' }}>{currencyFormatter(amount)}</div>

          if (value === 'input') amount = currentClosedBalance.totalBalanceInput
          if (value === 'sales') amount = currentClosedBalance.totalBalancePayment
          if (value === 'diff') amount = currentClosedBalance.diffBalance


          return (
            <div style={{ textAlign: 'end' }}>{currencyFormatter(amount)}</div>
          )
        }
      })
    })
  ]

  const dataSource = [
    {
      description: 'Cashier Input',
      type: 'input'
    },
    {
      description: 'Total Penjualan',
      type: 'sales'
    },
    {
      description: 'Total Selisih',
      type: 'diff'
    }
  ]

  return (
    <Col {...columnProps}>
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
        size="default"
      />
    </Col>
  )
}

export default List
