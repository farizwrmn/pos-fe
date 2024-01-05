import React from 'react'
import { Table, Icon } from 'antd'
import moment from 'moment'

const List = ({ onEdit, loading, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onEdit({
      ...record,
      viewAt: moment().format('YYYY-MM-DD HH:mm:ss')
    })
  }

  const columns = [
    {
      title: 'Store',
      dataIndex: 'store.storeName',
      key: 'store.storeName'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render (text, record) {
        return (<div>{record.name}</div>)
      }
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: (
            <div>
              {record.viewAt ? (<p>{record.url}</p>) : (
                <a onClick={() => handleMenuClick(record)} href={record.url ? record.url : ''} target="_blank" rel="noopener noreferrer">
                  {record.url}
                </a>
              )}
            </div>
          )
        }
      }
    },
    {
      title: 'Viewed',
      dataIndex: 'viewAt',
      key: 'viewAt',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: (
            <div>{record.viewAt ? <Icon type="check" /> : null}</div>
          )
        }
      }
    }
    // {
    //   title: 'Operation',
    //   key: 'operation',
    //   width: 100,
    //   fixed: 'right',
    //   render: (text, record) => {
    //     if (Number(record.isPrinted) === 1) {
    //       return <Button type="danger" disabled={loading.effects['planogram/edit']}>Printed</Button>
    //     }
    //     return <Button type="primary" disabled={loading.effects['planogram/edit']} onClick={() => handleMenuClick(record, 1)}>Validate Printed</Button>
    //   }
    // }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 500 }}
        columns={columns}
        simple
        pagination={false}
      />
    </div>
  )
}

export default List
