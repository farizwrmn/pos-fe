import { Table, Tag } from 'antd'

const List = ({ handleChange, dataSource, pagination, loading, openDetail }) => {
  const columns = [
    {
      title: 'Faktur Penjualan',
      dataIndex: 'payment.posPayment.transNo',
      key: 'payment.posPayment.transNo',
      width: 150,
      render: (value, record) => {
        return (
          <div style={{ textAlign: 'center' }} onClick={() => openDetail(record.id)}>
            <a>
              {value}
            </a>
          </div>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'resolved',
      key: 'resolved',
      width: 150,
      render: value => <div style={{ textAlign: 'center' }}>{Number(value) === 1 ? <Tag color="green">Resolved</Tag> : <Tag color="red">Conflict</Tag>}</div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: value => (value || '-')
    }
  ]

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      size="default"
      scroll={{ x: 600 }}
      bordered
      onChange={handleChange}
      pagination={pagination}
      loading={loading}
    />
  )
}

export default List
