import { Button, Checkbox, Col, Row, Table } from 'antd'

const List = ({
  ...tableProps,
  handlePagination,
  handleDelete,
  loading,
  selectedRemoveList,
  handleCostSettingMenu
}) => {
  const columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      width: 100
    },
    {
      title: 'Payment Option',
      key: 'paymentOption',
      dataIndex: 'paymentOption',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Account',
      key: 'accountName',
      dataIndex: 'accountName',
      width: 100,
      render: (value, record) => `${record.accountCode} - ${value}`
    },
    {
      title: 'Remove',
      width: 30,
      render: (_, record) => {
        const filteredSelectedRemoveList = selectedRemoveList.filter(filtered => filtered === record.id)
        const checked = (filteredSelectedRemoveList && filteredSelectedRemoveList[0])
        return (
          <div style={{ textAlign: 'center' }}>
            <Checkbox checked={checked} onChange={(event) => { handleDelete(event, record) }} />
          </div>
        )
      }
    },
    {
      title: 'Cost',
      width: 100,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={() => { handleCostSettingMenu(record) }} size="small">Edit Cost</Button>
        </div>
      )
    }
  ]

  return (
    <div>
      <Row>
        <Col>
          <Table
            {...tableProps}
            bordered
            columns={columns}
            onChange={handlePagination}
            loading={loading.effects['paymentMachineStore/query']}
          />
        </Col>
      </Row>
    </div>
  )
}

export default List
