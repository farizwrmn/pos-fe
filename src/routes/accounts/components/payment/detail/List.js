import React from 'react'
import PropTypes from 'prop-types'
import { DropOption } from 'components'
import { Table, Modal, Icon, Tag } from 'antd'
import moment from 'moment'

const List = ({ cancelPayment, cashierInformation = {}, ...tableProps }) => {
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      if (record.cashierTransId === cashierInformation.id) {
        cancelPayment(record)
      } else {
        Modal.warning({
          title: 'Can`t Void this Invoice',
          content: 'has been Closed'
        })
      }
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
      render: text => <p style={{ textAlign: 'right' }}>{text}</p>
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
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 120,
      render: _text => `${moment(_text).format('LL')}`
    },
    {
      title: 'Trans Time',
      dataIndex: 'transTime',
      key: 'transTime',
      width: 53
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
            { key: '1', name: 'Void', icon: 'delete', disabled: record.cashierTransId !== cashierInformation.id }
          ]}
        />)
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 987, y: 700 }}
        columns={columns}
        simple
        rowKey={record => record.no}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func,
  cancelPayment: PropTypes.func.isRequired,
  cashierInformation: PropTypes.object.isRequired
}

export default List
