import { Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'startDate',
      key: 'startDate'
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
    />
  )
}

export default List
