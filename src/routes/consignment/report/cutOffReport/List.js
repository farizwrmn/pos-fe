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
      key: 'vendor.name',
      width: 100,
      render: (value, record) => <div>{`${record['vendor.vendor_code']} - ${value}`}</div>

    },
    {
      title: 'Bank',
      dataIndex: 'vendor.bank_name',
      key: 'vendor.bank_name',
      width: 80,
      render: value => String(value).toUpperCase()
    },
    {
      title: 'No. Rek',
      dataIndex: 'vendor.account_number',
      key: 'vendor.account_number',
      width: 120
    },
    {
      title: 'Pemilik Rek',
      dataIndex: 'vendor.account_name',
      key: 'vendor.account_name',
      width: 150
    },
    {
      title: 'Total Penjualan',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Komisi',
      dataIndex: 'commission',
      key: 'commission',
      width: 100,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Biaya',
      dataIndex: 'charge',
      key: 'charge',
      width: 100,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Biaya Transfer',
      dataIndex: 'vendor.bank_name',
      key: 'trasnferCharge',
      width: 140,
      render: text => <div style={{ textAlign: 'end' }}> {(text.toLowerCase() !== 'bca' ? `Rp ${numberFormatter(5000)}` : `Rp ${numberFormatter(0)}`)}</div>
    },
    {
      title: 'Dibayarkan',
      dataIndex: 'total',
      key: 'payed',
      width: 120,
      render: (value, record) => {
        let total = record['vendor.bank_name'].toLowerCase() !== 'bca' ? `Rp ${numberFormatter(value - record.commission - record.charge - 5000)}` : `Rp ${numberFormatter(value - record.commission - record.charge)}`
        return (
          <div style={{ textAlign: 'end' }}>{total}</div>
        )
      }
    },
    {
      title: 'Email',
      dataIndex: 'vendor.email',
      key: 'vendor.email',
      width: 100,
      render: (value, record) => {
        return (
          <Tooltip placement="left" title={value}>
            <Button icon="mail" onClick={() => handleSendButton(record)} disabled={record.emailSent === 2}>
              {record.emailSent === 2 ? 'Sent' : 'Send Email'}
            </Button>
          </Tooltip>
        )
      }
    },
    {
      title: 'Durasi',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 140
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
        scroll={{ x: 1100 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
