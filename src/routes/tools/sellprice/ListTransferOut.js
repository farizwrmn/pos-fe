import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Button, Tag } from 'antd'
import ModalAccept from './ModalAccept'

const ListTransfer = ({ ...tableProps, showAcceptModal, modalAcceptVisible, updateFilter }) => {
  const clickPrint = (record) => {
    showAcceptModal(record)
  }
  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    updateFilter(filters, sorter)
  }

  const { dataSource } = tableProps

  const unique = (group, code) => {
    return group.map((key) => {
      return key[code]
    }).filter((e, index, array) => {
      return index === array.indexOf(e)
    })
  }

  const storeNames = dataSource !== undefined ? (dataSource.length > 0 ? unique(dataSource, 'storeName') : []) : []
  let filterStoreName = []
  for (let i = 0; i < storeNames.length; i += 1) {
    filterStoreName.push({ text: storeNames[i], value: storeNames[i] })
  }
  const columns = [
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('DD-MMM-YYYY')
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text =>
        (<span>
          <Tag color={text === '0' ? 'blue' : text === '1' ? 'green' : 'red'}>
            {text === '0' ? 'Not-updated' : text === '1' ? 'Updated' : 'Canceled'}
          </Tag>
        </span>)
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'CreatedBy',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'PIC',
      dataIndex: 'employeeName',
      key: 'employeeName'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (record) => {
        return <Button disabled={record.status !== '0'} onClick={() => clickPrint(record)}>Update</Button>
      }
    }
  ]

  return (
    <div>
      {modalAcceptVisible && <ModalAccept {...tableProps} />}
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
        onChange={handleChange}
      />
    </div>
  )
}

ListTransfer.propTypes = {
  sort: PropTypes.object,
  filter: PropTypes.object,
  updateFilter: PropTypes.func,
  onShowPrint: PropTypes.func,
  showPrintModal: PropTypes.bool,
  storeInfo: PropTypes.object,
  user: PropTypes.func,
  listTransferOut: PropTypes.object,
  getProducts: PropTypes.func,
  listProducts: PropTypes.object,
  listTransOut: PropTypes.object,
  showAcceptModal: PropTypes.func.isRequired
}

export default ListTransfer
