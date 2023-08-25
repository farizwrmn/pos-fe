import { Row, Table } from 'antd'
import moment from 'moment'

const ErrorLog = ({ onChangePagination, ...tableProps }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: value => moment(value).format('YYYY-MM-DD'),
      width: 100
    },
    {
      title: 'Key',
      dataIndex: 'logKey',
      key: 'logKey',
      width: 300
    },
    {
      title: 'Error Value',
      dataIndex: 'value',
      key: 'value',
      width: 600
    }
  ]

  return (
    <Row style={{ padding: '10px' }}>
      <h3 style={{ fontWeight: 'bolder' }}>
        Error Log
        Balance
      </h3>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        onChange={onChangePagination}
        scroll={{ x: 700 }}
      />
    </Row>
  )
}

export default ErrorLog
