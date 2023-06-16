import React from 'react'
import PropTypes from 'prop-types'
import { DropOption } from 'components'
import { Table, Icon, Tag } from 'antd'
import { numberFormat } from 'utils'

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
      width: 120
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
      title: 'Charge',
      dataIndex: 'chargeTotal',
      key: 'chargeTotal',
      width: 120,
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text)}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'paid',
      key: 'paid',
      width: 120,
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text)}</p>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 120,
      render: text => <p style={{ textAlign: 'left' }}>{text}</p>
    },
    {
      title: 'Machine',
      dataIndex: 'paymentMachine.name',
      key: 'paymentMachine.name',
      width: 120
    },
    {
      title: 'Card',
      dataIndex: 'cost.costBank.bankName',
      key: 'cost.costBank.bankName',
      width: 120
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 100
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
