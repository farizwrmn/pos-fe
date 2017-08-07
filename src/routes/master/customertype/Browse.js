import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const BrowseGroup = ({
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
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.typeCode)
        },
      })
    }
  }
  const columns = [
    {
      title: 'Code',
      dataIndex: 'typeCode',
      key: 'typeCode',
      width: '8%'
    }, {
      title: 'Type',
      dataIndex: 'typeName',
      key: 'typeName',
      width: '15%'
    }, {
      title: 'DISC(%)-1',
      dataIndex: 'discPct01',
      key: 'discPct01',
      width: '13%'
    }, {
      title: 'DISC(%)-2',
      dataIndex: 'discPct02',
      key: 'discPct02',
      width: '12%'
    }, {
      title: 'DISC(%)-3',
      dataIndex: 'discPct03',
      key: 'discPct03',
      width: '12%'
    }, {
      title: 'DISC(nominal)',
      dataIndex: 'discNominal',
      key: 'discNominal',
      width: '20%',
    },
    {
      title: 'Category',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '13%',
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
        scroll={{ x: 300, y: 240 }}
        columns={columns}
        simple
        rowKey={record => record.userId}
      />
    </div>
  )
}

BrowseGroup.propTypes = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default BrowseGroup
