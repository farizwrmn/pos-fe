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
        title: `Are you sure delete this record [ ${record.productCode} ] ?`,
        onOk () {
          onDeleteItem(record.productCode)
        },
      })
    }
  }
  const columns = [
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 80,
    },
    {
      title: 'P.Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 130,
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    }, {
      title: 'Brand',
      dataIndex: 'brandName',
      key: 'brandName',
      width: 170,
    }, {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: 90,
    }, {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
    }, {
      title: 'Location 1',
      dataIndex: 'location01',
      key: 'location01',
      width: 160,
    }, {
      title: 'Location 2',
      dataIndex: 'location02',
      key: 'location02',
      width: 160,
    }, {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 90,
    }, {
      title: 'Pre Price',
      dataIndex: 'sellPricePre',
      key: 'sellPricePre',
      width: 90,
    }, {
      title: 'Dist Price 1',
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      width: 90,
    }, {
      title: 'Dist Price 2',
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      width: 90,
    }, {
      title: 'Track Qty',
      dataIndex: 'trackQty',
      key: 'trackQty',
      width: 80,
    }, {
      title: 'Alert Qty',
      dataIndex: 'alertQty',
      key: 'alertQty',
      width: 100,
    }, {
      title: 'Exception',
      dataIndex: 'exception01',
      key: 'exception01',
      width: 100,
    }, {
      title: 'Image',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 100,
    }, {
      title: 'D.Code',
      dataIndex: 'dummyCode',
      key: 'dummyCode',
      width: 200,
    }, {
      title: 'Dummy Name',
      dataIndex: 'dummyName',
      key: 'dummyName',
      width: 220,
    }, {
      title: 'Similar 1',
      dataIndex: 'otherName01',
      key: 'otherName01',
      width: 200,
    }, {
      title: 'Similar 2',
      dataIndex: 'otherName02',
      key: 'otherName02',
      width: 200,
    }, {
      title: 'barCode 1',
      dataIndex: 'barCode01',
      key: 'barCode01',
      width: 200,
    }, {
      title: 'barCode 2',
      dataIndex: 'barCode02',
      key: 'barCode02',
      width: 200,
    }, {
      title: 'B.ID',
      dataIndex: 'brandId',
      key: 'brandId',
      width: 60,
    }, {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: 100
        }, {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 180,
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
          width: 100
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 180,
          render: (text) => `${moment(text).format('LL LTS')}`
        }
      ]
    }, {
      title: 'Operation',
      key: 'operation',
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
          <Button onClick={hdlButtonPrintClick}>
            <Icon type='printer'/> Print
          </Button>
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
        scroll={{ x: '3800', y: 240 }}
        columns={columns}
        simple
        size="small"
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
