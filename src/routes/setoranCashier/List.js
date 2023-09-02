import { Table, Tag } from 'antd'
import moment from 'moment'

const ListSummary = ({
  handlePagination,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      width: 100
    },
    {
      title: 'Shift',
      dataIndex: 'shiftName',
      key: 'shiftName',
      width: 100
    },
    {
      title: 'Opening',
      dataIndex: 'open',
      key: 'open',
      width: 100,
      render: value => moment(value).format('DD MMM YYYY, HH:mm:ss')
    },
    {
      title: 'Closed',
      dataIndex: 'closed',
      key: 'closed',
      width: 100,
      render: value => moment(value).format('DD MMM YYYY, HH:mm:ss')
    },
    {
      title: 'Status',
      dataIndex: 'pendingCount',
      key: 'pendingCount',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}><Tag color={Number(value || 0) > 0 ? 'red' : 'green'} >{Number(value || 0) > 0 ? 'Pending' : 'Completed'}</Tag></div>
    }
  ]

  return (
    <Table
      {...tableProps}
      columns={columns}
      bordered
      onChange={handlePagination}
    />
  )
}

export default ListSummary
