import { Button, Row, Table, Tag } from 'antd'
import { Link } from 'dva/router'

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
          <div style={{ textAlign: 'center' }}>
            <a onClick={() => handleClickRecord(record.id)}>{value}</a>
          </div>
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
    },
    {
      title: 'Action',
      render: (_, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Link to={`/setoran/cashier/detail/${record.id}`} target="_blank">
              <Button
                type="primary"
                icon="search"
                size="small"
              >
                See Detail
              </Button>
            </Link>
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
          loading={loading.effects['depositFinance/query'] || loading.effects['depositFinance/queryApproveLedger']}
          onChange={handlePagination}
        />
      </Row>
    </div>
  )
}

export default List
