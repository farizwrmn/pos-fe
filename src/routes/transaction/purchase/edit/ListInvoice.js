import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form, Modal, Row, Col, DatePicker } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { prefix } from 'utils/config.main'
import styles from '../../../../themes/index.less'

const { MonthPicker } = DatePicker
const FormItem = Form.Item
const Warning = Modal.confirm

const ListInvoice = ({ onInvoiceHeader, onChooseInvoice, purchase, dispatch, ...tableProps }) => {
  const { searchText, tmpInvoiceList } = purchase

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

    dispatch({
      type: 'purchase/updateState',
      payload: {
        searchText: value
      }
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'purchase/onInvoiceSearch',
      payload: {
        searchText,
        tmpInvoiceList
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'purchase/onInvoiceReset',
      payload: {
        searchText: '',
        tmpInvoiceList
      }
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
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Invoice Number',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'PO Number',
      dataIndex: 'referencePO',
      key: 'referencePO'
    },
    {
      title: 'Tax Invoice',
      dataIndex: 'taxInvoiceNo',
      key: 'taxInvoiceNo'
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Receive Date',
      dataIndex: 'receiveDate',
      key: 'receiveDate'
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName'
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
              <Input placeholder="Search Invoice Number"
                value={searchText}
                size="small"
                onChange={_e => handleChange(_e)}
                onPressEnter={handleSearch}
                style={{ marginBottom: 16 }}
              />
            </FormItem>
            <FormItem>
              <Button size="small" type="primary" onClick={handleSearch}>Search</Button>
            </FormItem>
            <FormItem>
              <Button size="small" type="primary" onClick={handleReset}>Reset</Button>
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
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={_record => handleMenuClick(_record)}
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
