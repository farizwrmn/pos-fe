import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Table, Tooltip } from 'antd'
import moment from 'moment'

const Confirm = Modal.confirm

const List = ({ ...tableProps, edit, onFilterChange }) => {
  const editConfirm = (record) => {
    Confirm({
      title: 'Edit vendor',
      content: 'Are you sure to edit this?',
      onOk () { edit(record) },
      onCancel () { }
    })
  }

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 50,
      render: (_, record) => <Button type="primary" onClick={() => editConfirm(record)}>Edit</Button>
    },
    {
      title: 'Vendor Profile',
      dataIndex: 'vendorProfile',
      key: 'vendorProfile',
      width: 200,
      render: (_, record) => {
        return (
          <div>
            <div style={{ fontWeight: 'bolder' }}>KODE: {record.vendor_code || ''}</div>
            <div>{record.name || ''}</div>
            <div>Commission: {record.commissionValue} %</div>
            <div>+62{record.phone || ''}</div>
            <div>
              <Tooltip placement="top" title="Whatsapp">
                <Button shape="circle" icon="message" type="primary" />
              </Tooltip>
              <Tooltip placement="top" title="Line">
                <Button shape="circle" icon="mobile" type="primary" />
              </Tooltip>
              <Tooltip placement="top" title="Phone">
                <Button shape="circle" icon="phone" type="primary" />
              </Tooltip>
            </div>
            <div>{record.email || ''}</div>

            <Tooltip placement="top" title="Email">
              <Button shape="circle" icon="mail" type="primary" />
            </Tooltip>
          </div>
        )
      }
    },
    {
      title: 'Status Outlet',
      dataIndex: 'rentRequest',
      key: 'rentRequest',
      render: (value) => {
        if (value.length > 0) {
          let outlet = value.map((record) => {
            const todayTime = moment()
            const daysLeft = moment(record.end_date).diff(todayTime, 'days')
            return {
              outletName: record.outlet.outlet_name,
              commissionValue: record.commissionValue,
              daysLeft
            }
          })
          console.log('outlet', outlet)
          return (
            <div>
              {outlet.map((record) => {
                return (
                  <div>
                    <div>{record.outletName}</div>
                    <div>Commission: {record.commissionValue} %</div>
                    <div>Berakhir {record.daysLeft} hari lagi</div>
                    <br />
                  </div>
                )
              })}
            </div>
          )
        }
        return 'Tidak ada'
      }
    },
    {
      title: 'Setuju T&C',
      dataIndex: 'is_agree_tnc',
      key: 'is_agree_tnc',
      width: 100,
      render: value => (value === 1 ? 'Agreed' : 'Not agreed')
    }
  ]

  const onChange = (pagination) => {
    onFilterChange({ pagination })
  }

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        onChange={onChange}
        scroll={{ x: 600 }}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
