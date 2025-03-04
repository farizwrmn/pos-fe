import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { lstorage } from 'utils'
import { Table } from 'antd'
import styles from '../../../themes/index.less'
import {
  groupProduct
} from './utils'

const { getCashierTrans, getServiceTrans, getConsignment, getBundleTrans } = lstorage

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
      dispatch
    } = this.props

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

    const product = getCashierTrans()
    const service = getServiceTrans()
    const consignment = getConsignment()
    const bundleItem = getBundleTrans()
    const bundle = groupProduct((product.filter(filtered => filtered.bundleId))
      .concat(service.filter(filtered => filtered.bundleId)), bundleItem)

    const onModalClick = (record) => {
      switch (record.typeTrans) {
        case 'Product':
          modalEditPayment(record)
          break
        case 'Service':
          modalEditService(record)
          break
        case 'Bundle':
          modalEditBundle(record)
          break
        case 'Consignment':
          modalEditConsignment(record)
          break
        default:
          break
      }
    }

    const listTrans = product
      .filter(filtered => !filtered.bundleId)
      .map(item => ({ ...item, posit: item.no, typeTrans: 'Product' }))
      .concat(bundle.map(item => ({ ...item, posit: item.no, typeTrans: 'Bundle' })))
      .concat(service.filter(filtered => !filtered.bundleId).map(item => ({ ...item, posit: item.no, typeTrans: 'Service' })))
      .concat(consignment.map(item => ({ ...item, posit: item.no, typeTrans: 'Consignment' })))
      .sort((a, b) => a.inputTime - b.inputTime)
      .map((item, index) => ({ ...item, no: index + 1 }))
      .sort((a, b) => b.no - a.no)

    return (
      // <Tabs activeKey="1">
      //   <TabPane tab={<Badge count={listTrans.length}>Sales</Badge>} key="1">
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
            dataIndex: 'no'
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
        onRowClick={record => onModalClick({
          ...record,
          no: record.posit
        })}
        dataSource={listTrans}
        pagination={false}
        style={{ marginBottom: 16 }}
      />
      //   </TabPane>
      // </Tabs>
    )
  }
}

TransactionDetail.propTypes = {
  dispatch: PropTypes.func.isRequired
}

export default TransactionDetail
