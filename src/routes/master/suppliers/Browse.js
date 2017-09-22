import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm, Dropdown, Menu } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const Browse = ({
  onAddItem, onEditItem, onDeleteItem, onDeleteBatch, onSearchShow,
  ...tableProps }) => {
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
        title: 'Are you sure delete this record?',
        onOk () {
          console.log('onOk', record)
          onDeleteItem(record.supplierCode)
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
      title: 'ID',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: '3%',
    },
    {
      title: 'Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: '8%',
    }, {
      title: 'Address 1',
      dataIndex: 'address01',
      key: 'address01',
      width: '7%',
    }, {
      title: 'Address 2',
      dataIndex: 'address02',
      key: 'address02',
      width: '7%',
    }, {
      title: 'City',
      dataIndex: 'cityId',
      key: 'cityId',
      width: '5%',
    }, {
      title: 'Province',
      dataIndex: 'state',
      key: 'state',
      width: '5%',
    }, {
      title: 'Post Code',
      dataIndex: 'zipCode',
      key: 'zipCode',
      width: '6%',
    }, {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      width: '6%',
    }, {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '6%',
    }, {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      width: '8%',
    }, {
      title: 'Tax ID',
      dataIndex: 'taxId',
      key: 'taxId',
      width: '8%',
    }, {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: '6%',
        }, {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: '8%',
          render: text => `${moment(text).format('LL LTS')}`,
        },
      ],
    }, {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: '6%',
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: '8%',
          render: text => `${moment(text).format('LL LTS')}`,
        },
      ],
    }, {
      title: 'Operation',
      key: 'operation',
      fixed: 'right',
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          menuOptions={[
            { key: '1', name: 'Edit', icon: 'edit' },
            { key: '2', name: 'Delete', icon: 'delete' },
          ]}
        />)
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
      <div style={{ margin: '10px 0' }}>
        <ButtonGroup size="small">
          <Button type="primary" onClick={hdlButtonAddClick}>
            <Icon type="plus-circle-o" /> Add
          </Button>
          <Dropdown overlay={menu}>
            <Button>
              <Icon type="printer" /> Print
            </Button>
          </Dropdown>
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
        scroll={{ x: 2500, y: 240 }}
        columns={columns}
        simple
        rowKey={record => record.userId}
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
