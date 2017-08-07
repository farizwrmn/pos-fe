import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'
import styles from './List.less'
import classnames from 'classnames'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const Unit = ({
  onDeleteUnit,
  loading,
  onAddItem,
  onEditUnit,
  onDeleteItem,
  onDeleteBatch,
  onSearchShow,
  ...tableProps
}) => {
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
  const hdlDropOptionCarClick = (record, e) => {
    if (e.key === '1') {
      onEditUnit(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          hdlDeleteUnit(record)
        },
      })
    }
  }

  const hdlDeleteUnit = (record) => {
    onDeleteUnit(record.policeNo)
  }

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'memberCode',
      key: 'memberCode',
      width: '8%',
      render: (text, record) => <Link to={`customer/${record.policeNo}`}>{text}</Link>,
    },
    {
      title: 'Nomor Polisi',
      dataIndex: 'policeNo',
      key: 'policeNo',
      width: '8%',
    },
    {
      title: 'Merk',
      dataIndex: 'merk',
      key: 'merk',
      width: '8%',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: '8%',
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      width: '8%',
    },
    {
      title: 'Tahun',
      dataIndex: 'year',
      key: 'year',
      width: '8%',
    },
    {
      title: 'Nomor Rangka',
      dataIndex: 'chassisNo',
      key: 'chassisNo',
      width: '8%',
    },
    {
      title: 'Nomor Mesin',
      dataIndex: 'machineNo',
      key: 'machineNo',
      width: '8%',
    },
    {
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
          width: '11%',
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
          width: '11%',
          render: text => `${moment(text).format('LL LTS')}`,
        },
      ],
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
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 1500 }}
        columns={columns}
        pagination
        simple
        size="small"
        rowKey={record => record.policeNo}
      />
    </div>
  )
}

Unit.propTypes = {
  onDeleteUnit: PropTypes.func,
  onAddItem: PropTypes.func,
  onEditUnit: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default Unit
