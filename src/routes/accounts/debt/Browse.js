import React from 'react'
import PropTypes from 'prop-types'
import { configMain } from 'utils'
import { Table, Input, Tag, Form, Row, Col, DatePicker } from 'antd'
import moment from 'moment'

const { MonthPicker } = DatePicker
const Search = Input.Search
const FormItem = Form.Item
const { prefix } = configMain

const BrowseGroup = ({
  dataSource, tmpDataSource, onSearchChange, onChangePeriod,
  form: { getFieldDecorator } }) => {
  const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
  const hdlSearch = (e) => {
    const reg = new RegExp(e, 'gi')
    let newData
    newData = tmpDataSource.map((record) => {
      const match = record.transNo.match(reg) || record.policeNo.match(reg) || record.cashierId.match(reg)
      if (!match) {
        return null
      }
      return {
        ...record
      }
    }).filter(record => !!record)
    onSearchChange(newData)
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
      sorter: (a, b) => moment.utc(a.transDate, 'YYYY/MM/DD') - moment.utc(b.transDate, 'YYYY/MM/DD'),
      render: _text => `${moment(_text).format('LL')}`
    },
    {
      title: 'Car Unit',
      dataIndex: 'policeNo',
      key: 'policeNo',
      width: 120
    },
    {
      title: 'KM',
      dataIndex: 'lastMeter',
      key: 'lastMeter',
      width: 120,
      sorter: (a, b) => a.lastMeter - b.lastMeter
    },
    {
      title: 'Cashier',
      dataIndex: 'cashierId',
      key: 'cashierId',
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
        </span>),
      filters: [{
        text: 'Active',
        value: 'A'
      }, {
        text: 'Canceled',
        value: 'C'
      }],
      filterMultiple: false,
      onFilter: (value, record) => record.status.indexOf(value) === 0
    },
    {
      title: 'Payment',
      dataIndex: 'paymentVia',
      key: 'paymentVia',
      width: 100,
      filters: [{
        text: 'CASH',
        value: 'C'
      }, {
        text: 'Pending',
        value: 'P'
      }, {
        text: 'Card',
        value: 'K'
      }],
      filterMultiple: false,
      onFilter: (value, record) => record.paymentVia.indexOf(value) === 0,
      render: text =>
        (<span>
          <Tag color={text === 'C' ? 'blue' : text === 'P' ? 'red' : 'green'}>
            {text === 'C' ? 'CASH' : text === 'P' ? 'PENDING' : 'CARD'}
          </Tag>
        </span>)
    }
  ]
  const onChange = (date, dateString) => {
    let dateFormat = moment(dateString).format('YYYY-MM-DD')
    let lastDate = moment(moment(dateFormat).endOf('month')).format('YYYY-MM-DD')
    onChangePeriod(dateFormat, lastDate)
  }

  return (
    <Form>
      <Row style={{ marginBottom: '10px' }}>
        <Col xl={12} lg={12} md={12}>
          <FormItem hasFeedBack >
            {getFieldDecorator('typeCode', {
              initialValue: moment.utc(storeInfo.startPeriod, 'YYYYMM'),
              rules: [{
                required: true
              }]
            })(<MonthPicker onChange={onChange} placeholder="Select Period" />)}
          </FormItem>
        </Col>
        <Col xl={12} lg={12} md={12} style={{ float: 'center' }}>
          <FormItem>
            <Search
              placeholder="Search Invoice"
              onSearch={value => hdlSearch(value)}
            />
          </FormItem>
        </Col>
      </Row>
      <Table pageSize={5} size="small" scroll={{ x: 1000, y: 800 }} bordered columns={columns} dataSource={dataSource} />
    </Form>
  )
}

BrowseGroup.propTypes = {
  form: PropTypes.isRequired,
  onChangePeriod: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  tmpDataSource: PropTypes.array.isRequired
}

export default Form.create()(BrowseGroup)
