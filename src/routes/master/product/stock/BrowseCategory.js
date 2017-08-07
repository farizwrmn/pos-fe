import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Icon, Popconfirm } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const Browse = ({
  onAddItem, onEditItem, onDeleteItem, onDeleteBatch, onSearchShow,
  ...tableProps }) => {

  const hdlButtonAddClick = () => {
    onAddItem()
  }
  const hdlButtonPrintClick = () => {
    console.log('add print here')
  }
  const hdlButtonSearchClick = () => {
    onSearchShow()
  }
  const hdlButtonDeleteClick = (selectedRowKeys) => {
    onDeleteBatch(selectedRowKeys)
  }
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record [ ${record.categoryCode} ] ?`,
        onOk () {
          onDeleteItem(record.categoryCode)
        },
      })
    }
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Code',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      width: 100,
    }, {
      title: 'Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
    }
  ]

  let selectedRowKeysLen = 0
  let selectedRowKeys
  if (tableProps.rowSelection) {
    selectedRowKeysLen = tableProps.rowSelection.selectedRowKeys.length
    selectedRowKeys= tableProps.rowSelection.selectedRowKeys
  }
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: '300', y: 240 }}
        columns={columns}
        simple
        rowKey={record => record.categoryCode}
      />
    </div>
  )
}

Browse.propTypes = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default Browse
