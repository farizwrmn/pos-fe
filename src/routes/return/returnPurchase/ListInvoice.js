import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form, Row, Col, DatePicker } from 'antd'
import { connect } from 'dva'
import moment from 'moment'

const { MonthPicker } = DatePicker
const FormItem = Form.Item

const ListInvoice = ({ onInvoiceHeader, onChooseInvoice, purchase, dispatch, ...tableProps }) => {
  const { searchText, tmpInvoiceList } = purchase

  const handleMenuClick = (record) => {
    onChooseInvoice(record)
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
      key: 'transNo',
      width: 580 * (25 / 100)
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 580 * (25 / 100)
    },
    {
      title: 'Receive Date',
      dataIndex: 'receiveDate',
      key: 'receiveDate',
      width: 580 * (25 / 100)
    },
    {
      title: 'SupplierName',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 580 * (25 / 100)
    }
  ]
  console.log('tableProps', tableProps)
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
