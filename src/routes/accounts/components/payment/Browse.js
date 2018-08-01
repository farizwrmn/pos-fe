import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Tag, Form, Row, Col, DatePicker } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import { configMain } from 'utils'
import styles from '../../../../themes/index.less'

const { MonthPicker } = DatePicker
const Search = Input.Search
const FormItem = Form.Item
const { prefix } = configMain

const leftColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12
}

const BrowseGroup = ({
  dataSource, tmpDataSource, onSearchChange, onChangePeriod,
  form: { getFieldDecorator } }) => {
  const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
  const hdlSearch = (e) => {
    const reg = new RegExp(e, 'gi')
    let newData
    newData = tmpDataSource.map((record) => {
      const match = record.transNo.match(reg) || record.policeNo.match(reg)
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
      render: (text, record) => (record.status === 'A' ? <Link to={`/accounts/payment/${encodeURIComponent(record.transNo)}`}>{text}</Link> : <p>{text}</p>)
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
      title: 'Member',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: 'Car Unit',
      dataIndex: 'policeNo',
      key: 'policeNo'
    },
    {
      title: 'KM',
      dataIndex: 'lastMeter',
      key: 'lastMeter',
      className: styles.alignRight,
      sorter: (a, b) => a.lastMeter - b.lastMeter,
      render: text => text.toLocaleString()
    },
    {
      title: 'Cashier',
      dataIndex: 'cashierId',
      key: 'cashierId'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy'
    }
  ]
  const onChange = (date, dateString) => {
    let dateFormat = moment(dateString).format('YYYY-MM-DD')
    let lastDate = moment(moment(dateFormat).endOf('month')).format('YYYY-MM-DD')
    onChangePeriod(dateFormat, lastDate)
  }

  return (
    <Form>
      <Row>
        <Col {...leftColumn}>
          <FormItem hasFeedBack >
            {getFieldDecorator('typeCode', {
              initialValue: moment.utc(storeInfo.startPeriod, 'YYYYMM'),
              rules: [{
                required: true
              }]
            })(<MonthPicker onChange={onChange} placeholder="Select Period" />)}
          </FormItem>
        </Col>
        <Col {...rightColumn}>
          <FormItem>
            <Search
              placeholder="Search Invoice"
              onSearch={value => hdlSearch(value)}
            />
          </FormItem>
        </Col>
      </Row>
      <Table bordered pageSize={5} size="small" columns={columns} dataSource={dataSource} />
    </Form>
  )
}

BrowseGroup.propTypes = {
  form: PropTypes.isRequired,
  onChangePeriod: PropTypes.func,
  onSearchChange: PropTypes.func,
  dataSource: PropTypes.array,
  tmpDataSource: PropTypes.array
}

export default Form.create()(BrowseGroup)
