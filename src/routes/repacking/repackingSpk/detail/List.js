import React from 'react'
import PropTypes from 'prop-types'
import { DropOption } from 'components'
import { numberFormat } from 'utils'
import { Table, Icon, Tag } from 'antd'
import moment from 'moment'

const numberFormatter = numberFormat.numberFormatter

const List = ({ cancelPayment, ...tableProps }) => {
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      cancelPayment(record)
    }
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 72
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 120,
      render: text =>
        (<span>
          <Tag color={parseInt(text, 10) ? 'blue' : 'red'}>
            {parseInt(text, 10) ? 'Active' : 'Canceled'}
          </Tag>
        </span>)
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 120,
      render: _text => `${moment(_text).format('LL')}`
    },
    {
      title: 'Time',
      dataIndex: 'transTime',
      key: 'transTime',
      width: 120
    },
    {
      title: 'Type Code',
      dataIndex: 'typeCode',
      key: 'typeCode',
      width: 100
    },
    {
      title: 'Amount',
      dataIndex: 'paid',
      key: 'paid',
      width: 120,
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text || 0)}</p>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 120,
      render: text => <p style={{ textAlign: 'left' }}>{text}</p>
    },
    {
      title: 'Card Name',
      dataIndex: 'cardName',
      key: 'cardName',
      width: 100
    },
    {
      title: 'Card No.',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 120
    },
    {
      title: 'Check No.',
      dataIndex: 'checkNo',
      key: 'checkNo',
      width: 120
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: _text => `${moment(_text).format('LL')}`
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 120
    },
    {
      title: 'UpdatedAt',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: _text => `${moment(_text).format('LL')}`
    },
    {
      title: <Icon type="setting" />,
      key: 'operation',
      fixed: 'right',
      width: 75,
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          type="primary"
          menuOptions={[
            { key: '1', name: 'Void', icon: 'delete' }
          ]}
        />)
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 1200, y: 700 }}
        columns={columns}
        simple
        rowKey={record => record.no}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func,
  cancelPayment: PropTypes.func.isRequired
}

export default List
