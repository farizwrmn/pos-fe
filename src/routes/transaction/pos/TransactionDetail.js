import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { lstorage, calendar } from 'utils'
import { Badge, Table, Tabs, Tag } from 'antd'
import styles from '../../../themes/index.less'
import {
  groupProduct
} from './utils'

const { dayByNumber } = calendar

const { getCashierTrans, getServiceTrans, getConsignment, getBundleTrans } = lstorage
const TabPane = Tabs.TabPane
const width = 1000

function addHandler (ele, trigger, handler) {
  if (window.addEventListener) {
    ele.addEventListener(trigger, handler, false)
    return false
  }
  window.attachEvent(trigger, handler)
}

function removeHandler (ele, trigger, handler) {
  if (window.addEventListener) {
    ele.removeEventListener(trigger, handler, false)
    return false
  }
  window.attachEvent(trigger, handler)
}

class TransactionDetail extends Component {
  state = {
    loading: false
  }

  componentDidMount () {
    addHandler(window, 'itemInserted', data => this.setListData(data))
    // this.setListData({ key: 'bundle_promo' })
  }

  componentWillUnmount () {
    removeHandler(window, 'itemInserted', data => this.setListData(data))
  }

  setListData (data) {
    console.log('setListData', data)
    if (data && (data.key === 'bundle_promo')) {
      this.setState({ loading: true })
      this.props.dispatch({ type: 'pos/setCurrentBuildComponent' })
      this.setState({ loading: false })
    }
  }

  render () {
    const {
      handleProductBrowse,
      dispatch,
      pos
    } = this.props
    const {
      paymentListActiveKey = '5'
    } = pos

    const objectSize = (text) => {
      let queue = []
      if (text === 'bundle_promo') {
        queue = localStorage.getItem(text) ? JSON.parse(localStorage.getItem(text)) : []
      } else {
        queue = localStorage.getItem(text) ? JSON.parse(localStorage.getItem(text)).filter(filtered => !filtered.hide) : []
      }
      return (queue || []).length
    }

    const modalEditPayment = (record) => {
      if (record && record.bundleId && record.replaceable) {
        dispatch({
          type: 'pos/updateState',
          payload: {
            currentReplaceBundle: record
          }
        })
        handleProductBrowse()
        return
      }
      dispatch({
        type: 'pos/getMechanics'
      })
      dispatch({
        type: 'pos/showPaymentModal',
        payload: {
          item: record,
          modalType: 'modalPayment'
        }
      })
    }

    const modalEditService = (record) => {
      if (record && record.bundleId) {
        return
      }
      dispatch({
        type: 'pos/getMechanics'
      })
      dispatch({
        type: 'pos/showServiceListModal',
        payload: {
          item: record,
          modalType: 'modalService'
        }
      })
    }

    const modalEditConsignment = (record) => {
      dispatch({
        type: 'pos/showConsignmentListModal',
        payload: {
          item: record,
          modalType: 'modalConsignment'
        }
      })
    }

    const modalEditBundle = (item) => {
      dispatch({
        type: 'pos/openBundleCategory',
        payload: {
          bundleId: item.bundleId,
          mode: 'edit',
          currentBundle: item
        }
      })
    }

    const changePaymentListTab = (key) => {
      dispatch({
        type: 'pos/updateState',
        payload: {
          paymentListActiveKey: key
        }
      })
    }

    const product = getCashierTrans()
    const service = getServiceTrans()
    const consignment = getConsignment()
    const bundleItem = getBundleTrans()
    const bundle = groupProduct((product.filter(filtered => filtered.bundleId))
      .concat(service.filter(filtered => filtered.bundleId)), bundleItem)

    const listTrans = product
      .filter(filtered => !filtered.bundleId)
      .map(item => ({ ...item, typeTrans: 'Product' }))
      .concat(bundle.map(item => ({ ...item, typeTrans: 'Bundle' })))
      .concat(service.filter(filtered => !filtered.bundleId).map(item => ({ ...item, typeTrans: 'Service' })))
      .concat(consignment.map(item => ({ ...item, typeTrans: 'Consignment' })))
      .map((item, index) => ({ ...item, no: index + 1 }))

    return (
      <Tabs activeKey={paymentListActiveKey} defaultActiveKey="5" onChange={key => changePaymentListTab(key)} >
        <TabPane tab={<Badge count={objectSize('cashier_trans')}>Product   </Badge>} key="1">
          <Table
            rowKey={(record, key) => key}
            bordered
            size="small"
            scroll={{ x: '580px', y: '780px' }}
            locale={{
              emptyText: 'Your Payment List'
            }}
            columns={[
              {
                title: 'No',
                width: '50px',
                dataIndex: 'no',
                sortOrder: 'descend',
                sorter: (a, b) => a.no - b.no
              },
              {
                title: 'Product',
                dataIndex: 'code',
                width: '290px',
                render: (text, record) => {
                  if (record && record.bundleId) {
                    return (
                      <div>
                        <div><strong>{record.code}</strong>-{record.name} ({record.bundleName})</div>
                      </div>
                    )
                  }
                  return (
                    <div>
                      <div><strong>{record.code}</strong>-{record.name}</div>
                    </div>
                  )
                }
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
                width: '40px',
                className: styles.alignCenter,
                render: text => (text || 0).toLocaleString()
              },
              {
                title: 'Price',
                dataIndex: 'sellPrice',
                width: '100px',
                className: styles.alignRight,
                render: (text, record) => {
                  // const sellPrice = record.sellPrice - record.price > 0 ? record.sellPrice : record.price
                  // const disc1 = record.disc1
                  // const disc2 = record.disc2
                  // const disc3 = record.disc3
                  // const discount = record.discount
                  const total = record.total
                  return (
                    <div>
                      <strong>{`Total: ${(total || 0).toLocaleString()}`}</strong>
                    </div>
                  )
                }
              }
            ]}
            onRowClick={record => modalEditPayment(record)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            dataSource={getCashierTrans().filter(filtered => (filtered.bundleId && !filtered.hide) || !filtered.bundleId)}
            style={{ marginBottom: 16 }}
          />
        </TabPane>
        <TabPane tab={<Badge count={objectSize('service_detail')}>Service</Badge>} key="2">
          <Table
            rowKey={(record, key) => key}
            bordered
            size="small"
            scroll={{ x: '580px', y: '780px' }}
            locale={{
              emptyText: 'Your Payment List'
            }}
            columns={[
              {
                title: 'No',
                width: '40px',
                dataIndex: 'no',
                sortOrder: 'descend',
                sorter: (a, b) => a.no - b.no
              },
              {
                title: 'Product',
                dataIndex: 'code',
                width: '300px',
                render: (text, record) => {
                  if (record && record.bundleId) {
                    return (
                      <div>
                        <div><strong>{record.code}</strong>-{record.name} ({record.bundleName})</div>
                      </div>
                    )
                  }
                  return (
                    <div>
                      <div><strong>{record.code}</strong>-{record.name}</div>
                    </div>
                  )
                }
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
                width: '40px',
                className: styles.alignCenter,
                render: text => (text || 0).toLocaleString()
              },
              {
                title: 'Price',
                dataIndex: 'sellPrice',
                width: '100px',
                className: styles.alignRight,
                render: (text, record) => {
                  const total = record.total
                  return (
                    <div>
                      <strong>{`Total: ${(total || 0).toLocaleString()}`}</strong>
                    </div>
                  )
                }
              }
            ]}
            onRowClick={_record => modalEditService(_record)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            dataSource={getServiceTrans().filter(filtered => (filtered.bundleId && !filtered.hide) || !filtered.bundleId)}
            style={{ marginBottom: 16 }}
          />
        </TabPane>
        <TabPane tab={<Badge count={objectSize('consignment')}>Consignment</Badge>} key="3">
          <Table
            rowKey={(record, key) => key}
            bordered
            size="small"
            scroll={{ x: '580px', y: '780px' }}
            locale={{
              emptyText: 'Your Consignment List'
            }}
            columns={[
              {
                title: 'No',
                width: '40px',
                dataIndex: 'no',
                sortOrder: 'descend',
                sorter: (a, b) => a.no - b.no
              },
              {
                title: 'Product',
                dataIndex: 'code',
                width: '300px',
                render: (text, record) => {
                  return (
                    <div>
                      <div><strong>{record.code}</strong>-{record.name}</div>
                    </div>
                  )
                }
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
                width: '40px',
                className: styles.alignCenter,
                render: text => (text || 0).toLocaleString()
              },
              {
                title: 'Price',
                dataIndex: 'sellPrice',
                width: '100px',
                className: styles.alignRight,
                render: (text, record) => {
                  // const sellPrice = record.sellPrice - record.price > 0 ? record.sellPrice : record.price
                  // const disc1 = record.disc1
                  // const disc2 = record.disc2
                  // const disc3 = record.disc3
                  // const discount = record.discount
                  const total = record.total
                  return (
                    <div>
                      <div>
                        <strong>{`Total: ${(total || 0).toLocaleString()}`}</strong>
                      </div>
                    </div>
                  )
                }
              }
            ]}
            onRowClick={_record => modalEditConsignment(_record)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            dataSource={getConsignment()}
            pagination={false}
            style={{ marginBottom: 16 }}
          />
        </TabPane>
        <TabPane tab={<Badge count={objectSize('bundle_promo')}>Bundle</Badge>} key="4">
          <Table
            rowKey={(record, key) => key}
            bordered
            size="small"
            scroll={{ x: '1000px', y: '780px' }}
            locale={{
              emptyText: 'Your Bundle List'
            }}
            onRowClick={_record => modalEditBundle(_record)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            dataSource={getBundleTrans()}
            style={{ marginBottom: 16 }}
            columns={[
              {
                title: 'No',
                dataIndex: 'no',
                key: 'no',
                width: '47px',
                sortOrder: 'descend',
                sorter: (a, b) => a.no - b.no
              },
              {
                title: 'Product',
                dataIndex: 'code',
                width: '250px',
                render: (text, record) => {
                  return (
                    <div>
                      <div><strong>{record.code}</strong>-{record.name}</div>
                    </div>
                  )
                }
              },
              {
                title: 'Q',
                dataIndex: 'qty',
                width: '40px',
                className: styles.alignRight,
                render: text => (text || '-').toLocaleString()
              },
              {
                title: 'Period',
                dataIndex: 'Date',
                key: 'Date',
                width: `${width * 0.15}px`,
                render: (text, record) => {
                  return `${moment(record.startDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')} ~ ${moment(record.endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`
                }
              },
              {
                title: 'Available Date',
                dataIndex: 'availableDate',
                key: 'availableDate',
                width: `${width * 0.15}px`,
                render: (text) => {
                  let date = text !== null ? text.split(',').sort() : <Tag color="green">{'Everyday'}</Tag>
                  if (text !== null && (date || []).length === 7) {
                    date = <Tag color="green">{'Everyday'}</Tag>
                  }
                  if (text !== null && (date || []).length < 7) {
                    date = date.map(dateNumber => <Tag color="blue">{dayByNumber(dateNumber)}</Tag>)
                  }
                  return date
                }
              },
              {
                title: 'Available Hour',
                dataIndex: 'availableHour',
                key: 'availableHour',
                width: `${width * 0.1}px`,
                render: (text, record) => {
                  return `${moment(record.startHour, 'HH:mm:ss').format('HH:mm')} ~ ${moment(record.endHour, 'HH:mm:ss').format('HH:mm')}`
                }
              }
            ]}
          />
        </TabPane>
        <TabPane tab={<Badge count={listTrans.length}>Sales</Badge>} key="5">
          <Table
            rowKey={(record, key) => key}
            bordered
            size="small"
            scroll={{ x: '580px', y: '780px' }}
            locale={{
              emptyText: 'Your Sales List'
            }}
            columns={[
              {
                title: 'No',
                width: '60px',
                dataIndex: 'no',
                sortOrder: 'descend',
                sorter: (a, b) => a.no - b.no
              },
              {
                title: 'Type',
                dataIndex: 'typeTrans',
                width: '130px'
              },
              {
                title: 'Product',
                dataIndex: 'code',
                width: '300px',
                render: (text, record) => {
                  return (
                    <div>
                      <div><strong>{record.code}</strong>-{record.name}</div>
                    </div>
                  )
                }
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
                width: '40px',
                className: styles.alignCenter,
                render: text => (text).toLocaleString()
              },
              {
                title: 'Price',
                dataIndex: 'sellPrice',
                width: '100px',
                className: styles.alignRight,
                render: (text, record) => {
                  // const sellPrice = record.sellPrice - record.price > 0 ? record.sellPrice : record.price
                  // const disc1 = record.disc1
                  // const disc2 = record.disc2
                  // const disc3 = record.disc3
                  // const discount = record.discount
                  const total = record.total
                  return (
                    <div>
                      <div>
                        <strong>{`Total: ${(total || 0).toLocaleString()}`}</strong>
                      </div>
                    </div>
                  )
                }
              }
            ]}
            rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            dataSource={listTrans}
            pagination={false}
            style={{ marginBottom: 16 }}
          />
        </TabPane>
      </Tabs>
    )
  }
}

TransactionDetail.propTypes = {
  pos: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default TransactionDetail
