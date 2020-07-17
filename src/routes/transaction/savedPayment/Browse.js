import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon, Input, Tag, Form, Row, Col, DatePicker } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { configMain, alertModal } from 'utils'

const { checkPermissionMonthTransaction } = alertModal
const { MonthPicker } = DatePicker
const Search = Input.Search
const FormItem = Form.Item
const { prefix } = configMain

const filterItemLayout = {
  xs: { span: 12 },
  sm: { span: 16 },
  md: { span: 16 },
  lg: { span: 17 }
}

const searchBarLayout = {
  xs: { span: 24 },
  sm: { span: 8 },
  md: { span: 8 },
  lg: { span: 7 }
}

const BrowseGroup = ({
  dispatch,
  dataSource,
  tmpDataSource,
  onGetDetail,
  cashierInformation,
  onShowCancelModal,
  onSearchChange,
  onChangePeriod,
  loading,
  app,
  form: { getFieldDecorator }
}) => {
  const { user } = app
  const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onGetDetail(record)
    } else if (e.key === '2') {
      dispatch(routerRedux.push({
        pathname: `/accounts/payment/${encodeURIComponent(record.transNo)}`
      }))
    } else if (e.key === '3') {
      const transDate = moment(record.transDate).format('YYYY-MM-DD')

      const checkPermission = checkPermissionMonthTransaction(transDate)
      if (checkPermission) {
        return
      }

      if (transDate >= storeInfo.startPeriod || record.transDate === cashierInformation.id) {
        onShowCancelModal(record)
      } else {
        Modal.warning({
          title: 'Can`t Void this Invoice',
          content: 'has been Closed'
        })
      }
    }
  }
  const hdlSearch = (e) => {
    const reg = new RegExp(e, 'gi')
    let newData
    newData = tmpDataSource.map((record) => {
      const match = (record.transNo || '').match(reg) || (record.cashierId || '').match(reg) || (record.policeNo || '').match(reg) || (record.cashierName || '').match(reg)
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
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 150,
      sorter: (a, b) => moment.utc(a.transDate, 'YYYY/MM/DD') - moment.utc(b.transDate, 'YYYY/MM/DD'),
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
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 180
    },
    {
      title: <Icon type="setting" />,
      key: 'operation',
      fixed: 'right',
      width: 75,
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          type="primary"
          menuOptions={(
            user.permissions.role === 'OWN'
            || user.permissions.role === 'SPR'
            || user.permissions.role === 'ADM'
          ) ? [
              { key: '1', name: 'Print', icon: 'printer' },
              { key: '2', name: 'Payment', icon: 'pay-circle-o' },
              { key: '3', name: 'Void', icon: 'delete' }
            ] : [
              { key: '1', name: 'Print', icon: 'printer' }
            ]}
        />)
      }
    }
  ]
  const onChange = (date, dateString) => {
    let dateFormat = moment(dateString).format('YYYY-MM-DD')
    let lastDate = moment(moment(dateFormat).endOf('month')).format('YYYY-MM-DD')
    onChangePeriod(dateFormat, lastDate)
  }

  const disabledDate = (current) => {
    return current > moment().endOf('month')
  }

  return (
    <Form>
      <Row style={{ marginBottom: '10px' }}>
        <Col {...filterItemLayout} >
          <FormItem hasFeedBack >
            {getFieldDecorator('period', {
              initialValue: moment(new Date(), 'YYYYMM'),
              rules: [{
                required: true
              }]
            })(<MonthPicker disabledDate={disabledDate} onChange={onChange} placeholder="Select Period" />)}
          </FormItem>
        </Col>
        <Col {...searchBarLayout}>
          <FormItem>
            <Search
              placeholder="Search Invoice"
              onSearch={value => hdlSearch(value)}
            />
          </FormItem>
        </Col>
      </Row>
      <Table pageSize={5} size="small" scroll={{ x: 1000, y: 500 }} bordered columns={columns} dataSource={dataSource} loading={loading} />
    </Form>
  )
}

BrowseGroup.propTypes = {
  form: PropTypes.isRequired,
  onGetDetail: PropTypes.func,
  onChangePeriod: PropTypes.func,
  onSearchChange: PropTypes.func,
  onShowCancelModal: PropTypes.func,
  dataSource: PropTypes.array,
  tmpDataSource: PropTypes.array
}

export default Form.create()(BrowseGroup)
