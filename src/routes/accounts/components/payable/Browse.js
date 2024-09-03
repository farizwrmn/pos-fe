import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Tag, Form, Row, Col, Icon, DatePicker, Button } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'
import { numberFormat, formatDate } from 'utils'
import styles from '../../../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const { RangePicker } = DatePicker
const Search = Input.Search
const FormItem = Form.Item
// const { prefix } = configMain

const leftColumn = {
  md: 24,
  lg: 12
}

const rightColumn = {
  md: 24,
  lg: 12
}

const BrowseGroup = ({
  dataSource,
  tmpDataSource,
  onChangePeriod,
  q,
  from,
  to,
  loading,
  openModalTax,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  },
  ...browseProps
}) => {
  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 120,
      render: (text, record) => (record.statusActive === '1' ? <Link to={`/accounts/payable/${encodeURIComponent(record.transNo)}`}>{text}</Link> : <p>{text}</p>)
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: 120
    },
    {
      title: 'Tax Invoice',
      dataIndex: 'taxInvoiceNo',
      key: 'taxInvoiceNo',
      width: 120,
      render: (text, record) => {
        if (record && record.taxInvoiceNo && record.taxInvoiceNo.length > 0) {
          return <div onClick={() => openModalTax(record)} style={{ color: 'green' }}>{text}<Icon type="edit" /></div>
        }
        return <Button type="primary" onClick={() => openModalTax(record)}>Add Tax</Button>
      }
    },
    {
      title: 'Tax Date',
      dataIndex: 'taxDate',
      key: 'taxDate',
      width: 120
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
      dataIndex: 'transDate',
      key: 'transDate',
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
      dataIndex: 'netto',
      key: 'netto',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Retur',
      dataIndex: 'returnTotal',
      key: 'returnTotal',
      width: 100,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Owing',
      dataIndex: 'paymentTotal',
      key: 'paymentTotal',
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
      render: text => (
        <span>
          <Tag color={text === '1' ? 'blue' : text === '0' ? 'red' : 'white'}>
            {text === '1' ? 'Active' : text === '0' ? 'Canceled' : ''}
          </Tag>
        </span>
      ),
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

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      let from
      let to
      if (data.transDate && data.transDate[0] && data.transDate[1]) {
        from = data.transDate[0].format('YYYY-MM-DD')
        to = data.transDate[1].format('YYYY-MM-DD')
      }
      onChangePeriod(data.q, from, to)
    })
  }

  return (
    <Form>
      <Row style={{ marginBottom: '10px' }}>
        <Col {...leftColumn}>
          <FormItem hasFeedBack >
            {getFieldDecorator('transDate', {
              initialValue: from && to ? [moment.utc(from, 'YYYY-MM-DD'), moment.utc(to, 'YYYY-MM-DD')] : [],
              rules: [{
                required: false
              }]
            })(<RangePicker placeholder="Select Period" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('q', {
              initialValue: q
            })(
              <Search
                placeholder="Search"
                onSearch={() => handleOk()}
              />
            )}
          </FormItem>
          <Button disabled={loading} onClick={() => handleOk()} type="primary" icon="search">Search</Button>
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
                Payable Form
              </Button>
            </Link>
          </FormItem>
        </Col>
      </Row>
      <Table {...browseProps} bordered size="small" scroll={{ x: 1000, y: 500 }} columns={columns} dataSource={dataSource} />
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
