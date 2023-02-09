import React from 'react'
import { numberFormat } from 'utils'
import { Button, Modal, Table, Tooltip } from 'antd'

const numberFormatter = numberFormat.numberFormatter

const List = ({
  ...tableProps,
  list,
  setCutOffReadyForEmail
}) => {
  const handleSendButton = (record) => {
    Modal.confirm({
      title: 'send email to vendor',
      content: 'Are you sure to send email to this vendor?',
      okText: 'Kirim',
      onOk () {
        setCutOffReadyForEmail(record.id)
      }
    })
  }

  const columns = [
    {
      title: 'Vendor',
      dataIndex: 'vendor.name',
      key: 'vendor.name'
    },
    {
      title: 'Bank',
      dataIndex: 'vendor.bank_name',
      key: 'vendor.bank_name',
      width: '50px'
    },
    {
      title: 'No. Rek',
      dataIndex: 'vendor.account_number',
      key: 'vendor.account_number',
      width: '100px'
    },
    {
      title: 'Pemilik Rek',
      dataIndex: 'vendor.account_name',
      key: 'vendor.account_name'
    },
    {
      title: 'Total Penjualan',
      dataIndex: 'total',
      key: 'total',
      width: '120px',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Komisi',
      dataIndex: 'commission',
      key: 'commission',
      width: '90px',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Biaya',
      dataIndex: 'charge',
      key: 'charge',
      width: '70px',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Biaya Transfer',
      dataIndex: 'vendor.bank_name',
      key: 'trasnferCharge',
      width: '100px',
      render: text => (text.toLowerCase() !== 'bca' ? `Rp ${numberFormatter(5000)}` : `Rp ${numberFormatter(0)}`)
    },
    {
      title: 'Dibayarkan',
      dataIndex: 'total',
      key: 'payed',
      width: '110px',
      render: (value, record) => {
        let total = record['vendor.bank_name'].toLowerCase() !== 'bca' ? `Rp ${numberFormatter(value - record.commission - record.charge - 5000)}` : `Rp ${numberFormatter(value - record.commission - record.charge)}`
        return total
      }
    },
    {
      title: 'Email',
      dataIndex: 'vendor.email',
      key: 'vendor.email',
      render: (value, record) => {
        return (
          <Tooltip placement="left" title={value}>
            <Button icon="mail" onClick={() => handleSendButton(record)}>
              Send Email
            </Button>
          </Tooltip>
        )
      }
    },
    {
      title: 'Durasi',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '140px',
      fixed: 'right'
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        dataSource={list}
        bordered
        columns={columns}
        simple
        pagination={false}
        scroll={{ x: 1500 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
