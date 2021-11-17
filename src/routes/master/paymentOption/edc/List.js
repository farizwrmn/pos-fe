import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { routerRedux } from 'dva/router'

const confirm = Modal.confirm

const List = ({ ...tableProps, dispatch, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      dispatch(routerRedux.push({
        pathname: `/master/paymentoption/cost/${record.id}`
      }))
    } else if (e.key === '2') {
      editItem(record)
    } else if (e.key === '3') {
      confirm({
        title: `Are you sure delete ${record.name} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, data) => {
        return (
          <div>
            <div>Code: {data.paymentOption}</div>
            <div>Name: {data.name}</div>
          </div>
        )
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'EDC Cost' },
              { key: '2', name: 'Edit' },
              { key: '3', name: 'Delete' }
            ]}
          />
        )
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
