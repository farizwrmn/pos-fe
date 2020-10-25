import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Tag, Form, Row, Col, DatePicker, Button } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import { numberFormat, formatDate } from 'utils'
import styles from '../../../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const { MonthPicker } = DatePicker
const Search = Input.Search
const FormItem = Form.Item
// const { prefix } = configMain

const leftColumn = {
  xs: 12,
  sm: 16,
  md: 16,
  lg: 17
}

const rightColumn = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 7
}

const BrowseGroup = ({
  dataSource, tmpDataSource, onSearchChange, onChangePeriod,
  form: { getFieldDecorator }, ...browseProps }) => {
  // const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
  const hdlSearch = (e) => {
    const reg = new RegExp(e, 'gi')
    let newData = tmpDataSource.map((record) => {
      const match = (record.transNo || '').match(reg) || (record.invoiceNo || '').match(reg) || (record.supplierName || '').match(reg) || (record.supplierCode || '').match(reg)
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
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 120,
      render: (text, record) => (record.statusActive === '1' ? <Link to={`/accounts/payable/${encodeURIComponent(record.transNo)}`}>{text}</Link> : <p>{text}</p>)
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      filters: tmpDataSource.map(item => ({
        text: item.supplierName,
        value: item.supplierName
      })),
      onFilter: (value, record) => record.supplierName.includes(value),
      width: 140
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 150,
      render: text => formatDate(text)
    },
    // {
    //   title: 'Car Unit',
    //   dataIndex: 'policeNo',
    //   key: 'policeNo',
    //   width: 120
    // },
    // {
    //   title: 'KM',
    //   dataIndex: 'lastMeter',
    //   key: 'lastMeter',
    //   width: 140,
    //   className: styles.alignRight,
    //   sorter: (a, b) => a.lastMeter - b.lastMeter,
    //   render: text => (text || '-').toLocaleString()
    // },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 100,
      sorter: (a, b) => moment.utc(a.transDate, 'YYYY-MM-DD') - moment.utc(b.transDate, 'YYYY-MM-DD'),
      render: text => formatDate(text)
    },
    {
      title: 'Total',
      dataIndex: 'nettoTotal',
      key: 'nettoTotal',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Owing',
      dataIndex: 'sisa',
      key: 'sisa',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Status',
      dataIndex: 'statusPaid',
      key: 'statusPaid',
      filters: [{
        text: 'Paid',
        value: 'PAID'
      }, {
        text: 'Partial',
        value: 'PARTIAL'
      }, {
        text: 'Pending',
        value: 'PENDING'
      }],
      onFilter: (value, record) => record.statusPaid.indexOf(value) === 0,
      width: 100,
      render: text => (
        <span>
          <Tag color={text === 'PAID' ? 'green' : text === 'PARTIAL' ? 'yellow' : 'red'}>
            {(text || '')}
          </Tag>
        </span>
      )
    },
    {
      title: 'Active',
      dataIndex: 'statusActive',
      key: 'statusActive',
      width: 120,
      render: text =>
        (<span>
          <Tag color={text === '1' ? 'blue' : text === '0' ? 'red' : 'white'}>
            {text === '1' ? 'Active' : text === '0' ? 'Canceled' : ''}
          </Tag>
        </span>),
      filters: [{
        text: 'Active',
        value: '1'
      }, {
        text: 'Canceled',
        value: '0'
      }],
      filterMultiple: false,
      onFilter: (value, record) => record.statusActive.indexOf(value) === 0
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
        <Col {...leftColumn}>
          <FormItem hasFeedBack >
            {getFieldDecorator('typeCode', {
              initialValue: moment.utc(moment(), 'YYYYMM'),
              rules: [{
                required: true
              }]
            })(<MonthPicker onChange={onChange} placeholder="Select Period" />)}
          </FormItem>
        </Col>
        <Col {...rightColumn}>
          <FormItem>
            <Link
              to="/accounts/payable-form"
            >
              <Button
                style={{ float: 'right' }}
                type="primary"
              >
                Add
              </Button>
            </Link>
          </FormItem>
          <FormItem>
            <Search
              placeholder="Search Invoice"
              onSearch={value => hdlSearch(value)}
            />
          </FormItem>
        </Col>
      </Row>
      <Table {...browseProps} bordered pageSize={5} size="small" scroll={{ x: 1000, y: 500 }} columns={columns} dataSource={dataSource} />
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
