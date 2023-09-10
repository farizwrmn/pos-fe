import { Row, Table, Tag } from 'antd'

const List = ({
  loading,
  onClickRecord,
  handlePagination,
  ...tableProps
}) => {
  const handleClickRecord = (transId) => {
    if (transId) {
      onClickRecord(transId)
    }
  }

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (value, record) => {
        return (
          <a onClick={() => handleClickRecord(record.id)}>{value}</a>
        )
      }
    },
    {
      title: 'Store',
      dataIndex: 'store.storeName',
      key: 'store.storeName'
    },
    {
      title: 'Cashier',
      dataIndex: 'user.userName',
      key: 'user.userName'
    },
    {
      title: 'Status',
      dataIndex: 'notReconCount',
      key: 'notReconCount',
      render: (value) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={value > 0 ? 'red' : 'green'}>
              {value > 0 ? 'Not Recon' : 'Recon'}
            </Tag>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <Row>
        <h3 style={{ fontWeight: 'bold' }}>List Deposit</h3>
      </Row>
      <Row>
        <Table
          {...tableProps}
          bordered
          columns={columns}
          loading={loading.effects['depositFinance/query']}
          onChange={handlePagination}
        />
      </Row>
    </div>
  )
}

export default List
