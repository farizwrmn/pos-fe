import React from 'react'
import { Link } from 'dva/router'
import { Table, Tag, Icon } from 'antd'
import moment from 'moment'

const List = (props) => {
  const columns = [
    {
      title: 'ID Permintaan',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        let status = <Tag color="grey">{record.status.toUpperCase()}</Tag>
        switch (record.status) {
          case 'approved': {
            status = <Tag color="green">{record.status.toUpperCase()}</Tag>
            break
          }
          case 'rejected': {
            status = <Tag color="#cf4c58">{record.status.toUpperCase()}</Tag>
            break
          }
          case 'canceled': {
            status = <Tag color="yellow">{record.status.toUpperCase()}</Tag>
            break
          }
          default: {
            status = <Tag color="grey">{record.status.toUpperCase()}</Tag>
          }
        }
        return (
          <div>
            <div>
              <Link to={`/integration/consignment/rent-request/${record.id}`}>
                BR-{moment(record.created_at).format('YYMM')}{String(record.id).padStart(8, '0')}
              </Link>
            </div>
            <div>{status}</div>
            <div>IDR {record.price.toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor_id',
      key: 'vendor_id',
      render: (text, record) => {
        return (
          <div>
            <div>Kode: {record.vendor ? record.vendor.vendor_code : ''}</div>
            <div>{record.vendor ? record.vendor.name : ''}</div>
            <div><Icon type="caret-right" style={{ color: '#28a745' }} /> {record.start_date}</div>
            <div><Icon type="minus-square" style={{ color: '#cf4c58' }} /> {record.end_date}</div>
          </div>
        )
      }
    },
    {
      title: 'Keterangan',
      dataIndex: 'createdby_id',
      key: 'createdby_id',
      render: (text, record) => {
        return (
          <div>
            <div>Dibuat oleh: {record.created ? record.created.name : ''}</div>
            <div>Status upload: {record.upload_date}</div>
            <div>Dipegang oleh: {record.handled ? record.handled.name : ''}</div>
            <div>Dibuat pada: {moment(record.created_at).format('DD-MMM-YYYY HH:mm')}</div>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <Table
        {...props}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
}

export default List
