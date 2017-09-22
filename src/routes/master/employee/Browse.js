import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Icon, Popconfirm, Dropdown, Menu } from 'antd'
import { DropOption } from 'components'

import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const Browse = ({
  onAddItem, onEditItem, onDeleteItem, onDeleteBatch, onSearchShow,
  ...tableProps }) => {

  console.log('tableProps.dataSource',tableProps.dataSource)
  const hdlButtonAddClick = () => {
    onAddItem()
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

  const menu = (
    <Menu>
      <Menu.Item key="1" ><PrintPDF dataSource={tableProps.dataSource} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS /></Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: 'Empl. Code',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 100
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 210,
    }, {
      title: 'Position',
      dataIndex: 'positionName',
      key: 'positionName',
      width: 80,
    }, {
      title: 'Address 1',
      dataIndex: 'address01',
      key: 'address01',
      width: 200,
    }, {
      title: 'Address 2',
      dataIndex: 'address02',
      key: 'address02',
      width: 200,
    }, {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 100,
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    }, {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: 70
        }, {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 150,
          render: (text) => `${moment(text).format('LL LTS')}`
        }
      ]
    }, {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: 70
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 150,
          render: (text) => `${moment(text).format('LL LTS')}`
        }
      ]
    }, {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          menuOptions = {[
            { key: '1', name: 'Edit', icon: 'edit' },
            { key: '2', name: 'Delete', icon: 'delete' }
          ]}
        />
      }
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
      <div style={{ 'margin-bottom': '10px' }}>
        <ButtonGroup size='small'>
          <Button type='primary' onClick={hdlButtonAddClick}>
            <Icon type='plus-circle-o' /> Add
          </Button>
          <Dropdown overlay={menu}>
            <Button>
              <Icon type="printer" /> Print
            </Button>
          </Dropdown>
          <Button onClick={hdlButtonSearchClick}>
            <Icon type='search'/> Search
          </Button>
          { selectedRowKeysLen > 1 &&
          <Popconfirm title={'Are you sure delete these items?'} onConfirm={ () => hdlButtonDeleteClick(selectedRowKeys) }>
            <Button type='danger'>
              <Icon type='delete'/> Batch Delete
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
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default Browse
