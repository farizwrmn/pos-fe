/**
 * Created by Veirry on 11/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Form } from 'antd'
import moment from 'moment'
import { DropOption } from 'components'

const History = ({ onGetAdjust, dataBrowse, onEditItem, ...historyProps }) => {
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
  }
  const columns = [
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '200'
    },
    {
      title: 'Type',
      dataIndex: 'transType',
      key: 'transType',
      width: '50'
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: '200'
    },
    {
      title: 'PIC',
      dataIndex: 'pic',
      key: 'pic',
      width: '100'
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '100',
      render: text => moment(text).format('DD-MMM-YYYY')
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo',
      width: '200'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: '100',
      fixed: 'right',
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          type="primary"
          menuOptions={[
            { key: '1', name: 'Edit', icon: 'edit' }
          ]}
        />)
      }
    }
  ]

  const handleGetAdjust = () => {
    onGetAdjust()
  }

  return (
    <Table
      {...historyProps}
      scroll={{ x: 1000, y: 500 }}
      columns={columns}
      simple
      bordered
      width="1000px"
      locale={{
        emptyText: <Button type="primary" onClick={() => handleGetAdjust()}>Reset</Button>
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
  onGetAdjust: PropTypes.func
}

export default Form.create()(History)
