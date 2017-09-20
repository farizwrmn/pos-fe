import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Icon, Popconfirm } from 'antd'
import { DropOption } from 'components'
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
        title: `Are you sure delete this record [ ${record.employeeId} ] ?`,
        onOk () {
          onDeleteItem(record.employeeId)
        },
      })
    }
  }

  const columns = [
    {
      title: 'Empl. Code',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 148,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 143,
    },
    {
      title: 'Position',
      dataIndex: 'positionName',
      key: 'positionName',
      width: 180,
    },
    {
      title: 'Address 1',
      dataIndex: 'address01',
      key: 'address01',
      width: 230,
    },
    {
      title: 'Address 2',
      dataIndex: 'address02',
      key: 'address02',
      width: 230,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 160,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: 70,
        }, {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 200,
          render: (text) => `${moment(text).format('LL LTS')}`,
        },
      ],
    },
    {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: 70,
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 200,
          render: (text) => `${moment(text).format('LL LTS')}`,
        },
      ],
    }, {
      title: 'Operation',
      key: 'operation',
      width: 81,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          menuOptions={[
            { key: '1', name: 'Edit', icon: 'edit' },
            { key: '2', name: 'Delete', icon: 'delete' }
          ]}
        />
      },
    },
  ]

  let selectedRowKeysLen = 0
  let selectedRowKeys
  if (tableProps.rowSelection) {
    selectedRowKeysLen = tableProps.rowSelection.selectedRowKeys.length
    selectedRowKeys = tableProps.rowSelection.selectedRowKeys
  }
  return (
    <div>
      <div style={{ 'margin-bottom': '10px' }}>
        <ButtonGroup size="small">
          <Button type="primary" onClick={hdlButtonAddClick}>
            <Icon type="plus-circle-o" /> Add
          </Button>
          <Button onClick={hdlButtonPrintClick}>
            <Icon type="printer" /> Print
          </Button>
          <Button onClick={hdlButtonSearchClick}>
            <Icon type="search" /> Search
          </Button>
          { selectedRowKeysLen > 1 &&
          <Popconfirm title={'Are you sure delete these items?'} onConfirm={() => hdlButtonDeleteClick(selectedRowKeys)}>
            <Button type="danger">
              <Icon type="delete" /> Batch Delete
            </Button>
          </Popconfirm>
          }
        </ButtonGroup>
        <span style={{ marginLeft: 8 }}>
          { selectedRowKeysLen > 0 && `${selectedRowKeysLen} items were selected`}
        </span>
      </div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: '1900', y: 240 }}
        columns={columns}
        simple
        rowKey={record => record.employeeId}
      />
    </div>
  )
}

Browse.propTypes = {
  onAddItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onSearchShow: PropTypes.func.isRequired,
  onDeleteBatch: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
}

export default Browse
