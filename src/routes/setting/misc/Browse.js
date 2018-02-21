import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Icon, Popconfirm, message } from 'antd'
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
  const hdlButtonDeleteClick = () => {
    // onDeleteBatch(selectedRowKeys)
    message.info('Not supported yet')
  }
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record [ ${record.miscCode} - ${record.miscName} ] ?`,
        onOk () {
          onDeleteItem(record.miscCode, record.miscName)
        }
      })
    }
  }
  const columns = [
    {
      title: 'Code',
      dataIndex: 'miscCode',
      key: 'miscCode',
      width: 70
    }, {
      title: 'Name',
      dataIndex: 'miscName',
      key: 'miscName',
      width: 100
    }, {
      title: 'Desc',
      dataIndex: 'miscDesc',
      key: 'miscDesc',
      width: 200
    }, {
      title: 'Variable',
      dataIndex: 'miscVariable',
      key: 'miscVariable',
      width: 150
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
          render: text => `${moment(text).format('LL LTS')}`
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
          render: text => `${moment(text).format('LL LTS')}`
        }
      ]
    }, {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          menuOptions={[
            { key: '1', name: 'Edit', icon: 'edit' },
            { key: '2', name: 'Delete', icon: 'delete' }
          ]}
        />)
      }
    }
  ]

  let selectedRowKeysLen = 0
  // let selectedRowKeys
  if (tableProps.rowSelection) {
    selectedRowKeysLen = tableProps.rowSelection.selectedRowKeys.length
    // selectedRowKeys = tableProps.rowSelection.selectedRowKeys
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
          <Popconfirm title={'Are you sure delete these items?'} onConfirm={() => hdlButtonDeleteClick()}>
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
        scroll={{ x: '1300', y: 240 }}
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
  location: PropTypes.object
}

export default Browse
