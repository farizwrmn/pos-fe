import { Table } from 'antd'
import { currencyFormatter } from 'utils/string'

const ListEntry = ({
  dataSource,
  listAccountCode,
  handleEditList,
  loading
}) => {
  const column = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 10
    },
    {
      title: 'Type',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 80,
      render: (value) => {
        const filteredAccount = (listAccountCode || []).filter(filtered => filtered.id === value)
        if (filteredAccount && filteredAccount[0]) {
          return (
            <div>{`${filteredAccount[0].accountName} (${filteredAccount[0].accountCode})`}</div>
          )
        }
      }
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: 80,
      render: value => currencyFormatter(value || 0)
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      width: 80,
      render: value => currencyFormatter(value || 0)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 160
    }
  ]

  let debit = (dataSource || []).reduce((prev, record) => {
    return prev + (record.debit || 0)
  }, 0)

  let credit = (dataSource || []).reduce((prev, record) => {
    return prev + (record.credit || 0)
  }, 0)

  const handleRowClick = (record) => {
    handleEditList(record)
  }

  return (
    <Table
      columns={column}
      dataSource={dataSource}
      footer={() => (
        <div>
          <div>Debit {currencyFormatter(debit)}</div>
          <div>Kredit {currencyFormatter(credit)}</div>
        </div>
      )}
      onRowClick={handleRowClick}
      loading={loading.effects['autorecon/queryDetail'] || loading.effects['autorecon/resolve']}
    />
  )
}

export default ListEntry
