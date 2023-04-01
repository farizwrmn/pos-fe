import { Table, Tag } from 'antd'

const dataSource = [
  {
    transNo: 'tes1',
    resolved: 1
  },
  {
    transNo: 'tes2',
    resolved: 0
  },
  {
    transNo: 'tes3',
    resolved: 0
  },
  {
    transNo: 'tes2',
    resolved: 1
  },
  {
    transNo: 'tes3',
    resolved: 1
  },
  {
    transNo: 'tes1',
    resolved: 1
  },
  {
    transNo: 'tes2',
    resolved: 0
  },
  {
    transNo: 'tes3',
    resolved: 0
  },
  {
    transNo: 'tes2',
    resolved: 1
  },
  {
    transNo: 'tes3',
    resolved: 1
  },
  {
    transNo: 'tes1',
    resolved: 1
  },
  {
    transNo: 'tes2',
    resolved: 0
  },
  {
    transNo: 'tes3',
    resolved: 0
  },
  {
    transNo: 'tes2',
    resolved: 1
  },
  {
    transNo: 'tes3',
    resolved: 1
  },
  {
    transNo: 'tes1',
    resolved: 1
  },
  {
    transNo: 'tes2',
    resolved: 0
  },
  {
    transNo: 'tes3',
    resolved: 0
  },
  {
    transNo: 'tes2',
    resolved: 1
  },
  {
    transNo: 'tes3',
    resolved: 1
  },
  {
    transNo: 'tes1',
    resolved: 1
  },
  {
    transNo: 'tes2',
    resolved: 0
  },
  {
    transNo: 'tes3',
    resolved: 0
  },
  {
    transNo: 'tes2',
    resolved: 1
  },
  {
    transNo: 'tes3',
    resolved: 1
  },
  {
    transNo: 'tes1',
    resolved: 1
  },
  {
    transNo: 'tes2',
    resolved: 0
  },
  {
    transNo: 'tes3',
    resolved: 0
  },
  {
    transNo: 'tes2',
    resolved: 1
  },
  {
    transNo: 'tes3',
    resolved: 1
  }
]

const columns = [
  {
    title: 'Faktur Penjualan',
    dataIndex: 'transNo',
    key: 'transNo',
    width: 150,
    render: value => <div style={{ textAlign: 'center' }}><a>{value}</a></div>
  },
  {
    title: 'Status',
    dataIndex: 'resolved',
    key: 'resolved',
    width: 150,
    render: value => <div style={{ textAlign: 'center' }}>{Number(value) === 1 ? <Tag color="green">Resolved</Tag> : <Tag color="red">Conflict</Tag>}</div>
  }
]

const List = () => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{
        defaultPageSize: 15,
        showQuickJumper: true,
        pageSize: 15,
        pageSizeOptions: ['15']
      }}
      size="default"
      scroll={{ x: 300 }}
      bordered
    />
  )
}

export default List
