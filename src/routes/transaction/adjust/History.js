/**
 * Created by Veirry on 11/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Form } from 'antd'
import { DropOption } from 'components'

const History = ({ onGetAdjust, onEditItem, form: { getFieldDecorator, getFieldsValue, validateFields }, ...historyProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '15%',
    },
    {
      title: 'Type',
      dataIndex: 'transType',
      key: 'transType',
      width: '15%',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: '15%',
    },
    {
      title: 'PIC',
      dataIndex: 'pic',
      key: 'pic',
      width: '15%',
    },
    {
      title: 'Created At',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '30%',
    },
    {
      title: 'Operation',
      key: 'operation',
      width: '10%',
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
                            type="primary"
                            menuOptions={[
                              { key: '1', name: 'Edit', icon: 'edit' },
                            ]}
        />)
      },
    },
  ]

  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
  }

  const handleGetAdjust = () => {
    onGetAdjust()
  }

  return (
    <Table
      {...historyProps}
      scroll={{ x: '1200px', y: 500 }}
      columns={columns}
      simple
      bordered
      width="1220px"
      locale={{
        emptyText: <Button type="primary" onClick={() => handleGetAdjust()}>Reset</Button>,
      }}
      size="small"
      rowKey={record => record.transNo}
    />
  )
}

History.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  onGetAdjust: PropTypes.func,
}

export default Form.create()(History)
