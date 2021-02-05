import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import moment from 'moment'

// const { MonthPicker } = DatePicker

const List = ({ addModalItem, modalProps, changePeriod, ...tableProps }) => {
  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Store Name Receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('DD MMMM YYYY')
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const nonActive = !record.active
        const received = record.status
        const inProgress = record.active && !record.status
        if (nonActive) {
          return (
            <Tag color="red">
              Canceled
            </Tag>
          )
        }
        if (inProgress) {
          return (
            <Tag color="blue">
              In Progress
            </Tag>
          )
        }
        if (received) {
          return (
            <Tag color="green">
              Accepted
            </Tag>
          )
        }
      }
    },
    {
      title: 'Posting',
      dataIndex: 'posting',
      key: 'posting',
      render: (text) => {
        if (text) {
          return (
            <Tag color="green">
              Posted
            </Tag>
          )
        }
        return (
          <Tag color="red">
            Not Posted
          </Tag>
        )
      }
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      render: (text) => {
        if (text) {
          return (
            <Tag color="green">
              Paid
            </Tag>
          )
        }
        return (
          <Tag color="red">
            Not Paid
          </Tag>
        )
      }
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => {
        return moment(text).format('DD MMM YYYY HH:mm:ss')
      }
    }
  ]

  // const onChange = (date, dateString) => {
  //   let dateFormat = moment(dateString).format('YYYY-MM-DD')
  //   let lastDate = moment(moment(dateFormat).endOf('month')).format('YYYY-MM-DD')
  //   changePeriod(dateFormat, lastDate)
  // }

  return (
    <div>
      <Modal {...modalProps}>
        {/* <MonthPicker style={{ marginBottom: 10 }} onChange={onChange} placeholder="Select Period" /> */}
        <Table {...tableProps}
          bordered
          columns={columns}
          simple
          scroll={{ x: 1000 }}
          rowKey={record => record.id}
          onRowClick={addModalItem}
        />
      </Modal>
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
