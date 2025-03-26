import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon, Input, Tag, Form, Row, Col, DatePicker } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { alertModal, lstorage } from 'utils'
import { prefix } from 'utils/config.main'
import styles from 'themes/index.less'

const { checkPermissionMonthTransaction, checkPermissionDayBeforeTransaction } = alertModal
const { RangePicker } = DatePicker
const Search = Input.Search
const FormItem = Form.Item

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

      const currentRole = lstorage.getCurrentUserRole()
      if (currentRole !== 'OWN' && currentRole !== 'ITS') {
        const checkPermissionDayBefore = checkPermissionDayBeforeTransaction(transDate)
        if (checkPermissionDayBefore) {
          return
        }
      }

      if (record && record.paymentVia && (record.paymentVia === 'PQ' || record.paymentVia === 'XQ')) {
        const listUserRole = lstorage.getListUserRoles()
        const checkRole = listUserRole.find(item => item.value === 'OWN' || item.value === 'ITS' || item.value === 'CAP')
        if (!checkRole) {
          Modal.error({
            title: 'Can`t Void this Invoice',
            content: 'Please contact administrator to void this invoice'
          })
          return
        }
      }

      if (transDate >= storeInfo.startPeriod) {
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

  const dropOptionWithPermission = [
    { key: '1', name: 'Print', icon: 'printer' },
    { key: '2', name: 'Payment', icon: 'pay-circle-o' },
    { key: '3', name: 'Void', icon: 'delete' }
  ]

  const dropOptionWithoutPermission = [
    { key: '1', name: 'Print', icon: 'printer' },
    { key: '3', name: 'Void', icon: 'delete' }
  ]

  const columns = [
    {
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 120
    },
    {
      title: 'Payment',
      dataIndex: 'paymentVia',
      key: 'paymentVia',
      width: 120
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 150,
      sorter: (a, b) => moment.utc(a.createdAt) - moment.utc(b.createdAt),
      render: (text, record) => `${text} ${record.transTime}`
    },
    {
      title: 'Total',
      dataIndex: 'posTotal.netto',
      key: 'posTotal.netto',
      width: 70,
      className: styles.alignRight,
      render: (text, record) => {
        if (record.paymentVia === 'C') {
          const splitted = (text || '-').toLocaleString().split('')
          let finalText = ''
          for (let key in splitted) {
            const str = splitted[key]
            console.log('key', key)
            if (Number(key) === 0 || str === ',' || str === '.') {
              finalText += str
            } else {
              finalText += 'X'
            }
          }
          return finalText
        }
        return (text || '-').toLocaleString()
      }
    },
    {
      title: 'Cashier',
      dataIndex: 'technicianName',
      key: 'technicianName',
      width: 120
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
      render: text => (
        <span>
          <Tag color={text === 'A' ? 'blue' : text === 'C' ? 'red' : 'green'}>
            {text === 'A' ? 'Active' : text === 'C' ? 'Canceled' : 'Non-Active'}
          </Tag>
        </span>
      ),
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
      title: 'Payment Status',
      dataIndex: 'validPayment',
      key: 'validPayment',
      width: 100,
      render: value => <div style={{ textAlign: 'center' }}><Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? 'Valid' : 'Not Valid'}</Tag></div>
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
            || user.permissions.role === 'ITS'
            || user.permissions.role === 'SPR'
            || user.permissions.role === 'ADF'
            || user.permissions.role === 'HPC'
            || user.permissions.role === 'SPC'
            || user.permissions.role === 'HFC'
            || user.permissions.role === 'SFC'
          ) ? dropOptionWithPermission : dropOptionWithoutPermission}
        />)
      }
    }
  ]
  const onChange = (date) => {
    let dateFormat = moment(date[0]).format('YYYY-MM-DD')
    let lastDate = moment(date[1]).format('YYYY-MM-DD')
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
              initialValue: [moment().startOf('month'), moment().endOf('month')],
              rules: [{
                required: true
              }]
            })(<RangePicker disabledDate={disabledDate} onChange={onChange} placeholder="Select Period" />)}
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
      <Table
        pageSize={5}
        size="small"
        scroll={{ x: 1000, y: 500 }}
        bordered
        columns={columns}
        dataSource={user.permissions.role === 'OWN'
          || user.permissions.role === 'ITS'
          || user.permissions.role === 'SPR'
          || user.permissions.role === 'ADF'
          || user.permissions.role === 'HPC'
          || user.permissions.role === 'SPC'
          || user.permissions.role === 'HFC'
          || user.permissions.role === 'SFC'
          ? dataSource.sort((a, b) => b.id - a.id) : dataSource.sort((a, b) => b.id - a.id)}
        loading={loading}
        pagination={user.permissions.role === 'OWN'
          || user.permissions.role === 'ITS'
          || user.permissions.role === 'SPR'
          || user.permissions.role === 'ADF'
          || user.permissions.role === 'HPC'
          || user.permissions.role === 'SPC'
          || user.permissions.role === 'HFC'
          || user.permissions.role === 'SFC'}
      />
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
