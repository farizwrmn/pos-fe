import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Form, Modal, Row, Col, DatePicker, Tag } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { prefix } from 'utils/config.main'
import styles from '../../../themes/index.less'

const { MonthPicker } = DatePicker
const FormItem = Form.Item
const Warning = Modal.confirm

const ListInvoice = ({ onInvoiceHeader, pos, loading, onChooseInvoice, dispatch, ...tableProps }) => {
  const { listPayment, tmpListPayment } = pos
  const handleMenuClick = (record) => {
    const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
    if (record.transDate < storeInfo.startPeriod) {
      record.readOnly = true
      Warning({
        title: 'Read-only Invoice',
        content: 'This Invoice cannot be edit',
        onOk () {
          onChooseInvoice(record)
        },
        onCancel () {
          console.log('cancel')
        }
      })
    } else if (record.transDate >= storeInfo.startPeriod) {
      record.readOnly = false
      Warning({
        title: 'Warning: change recorded activity',
        content: 'Do you want to replace recent activity',
        onOk () {
          onChooseInvoice(record)
        },
        onCancel () {
          console.log('cancel')
        }
      })
    }
  }

  const handleChange = (e) => {
    const { value } = e.target
    const reg = new RegExp(value, 'gi')
    let newData
    newData = tmpListPayment.map((record) => {
      const match = (record.transNo || '').match(reg) || (record.cashierId || '').match(reg) || (record.policeNo || '').match(reg) || (record.cashierName || '').match(reg)
      if (!match) {
        return null
      }
      return {
        ...record
      }
    }).filter(record => !!record)
    dispatch({
      type: 'pos/searchPOS',
      payload: newData
    })
  }

  const changeMonth = (date, dateString) => {
    let startPeriod = moment(dateString, 'YYYY-MM').startOf('month').format('YYYY-MM-DD')
    let endPeriod = moment(dateString, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
    const period = {
      startPeriod,
      endPeriod
    }
    onInvoiceHeader(period)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 180
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 150,
      render: (text, record) => `${text} ${record.transTime}`
    },
    {
      title: 'Cashier',
      dataIndex: 'technicianName',
      key: 'technicianName',
      width: 100
    },
    {
      title: 'Member',
      dataIndex: 'memberName',
      key: 'memberName',
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: text =>
        (<span>
          <Tag color={text === 'A' ? 'blue' : text === 'C' ? 'red' : 'green'}>
            {text === 'A' ? 'Active' : text === 'C' ? 'Canceled' : 'Non-Active'}
          </Tag>
        </span>)
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Owing',
      dataIndex: 'paymentTotal',
      key: 'paymentTotal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <Row>
          <Col lg={16} md={14}>
            <FormItem>
              <Input
                placeholder="Search Invoice Number"
                // value={searchText}
                onChange={_e => handleChange(_e)}
                onPressEnter={handleChange}
                style={{ marginBottom: 16 }}
              />
            </FormItem>
          </Col>
          <Col lg={8} md={10}>
            <FormItem>
              <MonthPicker onChange={changeMonth} placeholder="Select Period" />
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Table
        {...tableProps}
        bordered
        scroll={{ x: 500, y: 388 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={_record => handleMenuClick(_record)}
        dataSource={listPayment}
      />
    </div>
  )
}

ListInvoice.propTypes = {
  onChooseInvoice: PropTypes.func.isRequired,
  onInvoiceHeader: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
  purchase: PropTypes.isRequired,
  dispatch: PropTypes.isRequired
}

export default connect(({ purchase }) => ({ purchase }))(ListInvoice)
