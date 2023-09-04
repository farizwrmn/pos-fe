import { Button, Col, Table, Tag } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListResolve = ({
  handleChangePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Cashier Name',
      dataIndex: 'cashierName',
      key: 'cashierName'
    },
    {
      title: 'Selisih',
      dataIndex: 'diffBalance',
      key: 'diffBalance',
      render: value => <div style={{ textAlign: 'end' }}>{currencyFormatter(value)}</div>
    },
    {
      title: 'Status Resolve',
      dataIndex: 'statusResolved',
      key: 'statusResolved',
      render: value => <div style={{ textAlign: 'center' }}>{value || '-'}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        if (value === 'pending') {
          return (
            <div style={{ textAlign: 'center' }}>
              <Button type="primary">Resolve</Button>
            </div>
          )
        }
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color="green" >Completed</Tag>
          </div>
        )
      }
    }
  ]

  return (
    <Col span={24}>
      <h3 style={{ fontWeight: 'bold' }}>
        List Resolve
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

export default ListResolve
