import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Col, Collapse, Input, Row, Modal } from 'antd'
import { GlobalHotKeys } from 'react-hotkeys'
import { lstorage } from 'utils'
import List from './List'
import ListOrder from './ListOrder'
import ListDO from './ListDO'
import ListTransferOutDetail from './ListTransferOutDetail'
import ModalBoxNumber from './ModalBoxNumber'

const { Panel } = Collapse

const keyMap = {
  PRODUCT: 'f2',
  GROUPING: 'ctrl+1'
}

class DeliveryOrderPacker extends Component {
  state = {
    product: ''
  }

  componentDidMount () {
    // message.info('Buka aplikasi Fingerprint')
    // this.setEndpoint()
    setTimeout(() => {
      const selector = document.getElementById('input-product')
      if (selector) {
        selector.focus()
      }
    }, 300)

    setInterval(() => {
      const selector = document.getElementById('input-product')
      if (selector) {
        selector.focus()
      }
    }, 5000)
  }

  render () {
    const { deliveryOrderPacker, deliveryOrder: DOmodel, loading, dispatch, location, app } = this.props
    const { currentItem } = DOmodel
    const { listItem, deliveryOrder, listTransferOutHistory, latestBoxNumber, modalBoxNumberVisible } = deliveryOrderPacker
    const { user, storeInfo } = app

    const listProps = {
      dataSource: listItem,
      user,
      storeInfo,
      pagination: false,
      dispatch,
      loading: loading.effects['deliveryOrderPacker/queryDetail']
        || loading.effects['deliveryOrderPacker/groupingDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/addItemByBarcode']
        || loading.effects['deliveryOrderPacker/saveDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/loadDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/deleteDeliveryOrderCartItem'],
      location
    }

    const listDOProps = {
      dispatch,
      loading,
      currentItem
    }

    const listTransferOutDetailProps = {
      dataSource: listTransferOutHistory,
      pagination: false
    }

    const listOrderProps = {
      dataSource: deliveryOrder.deliveryOrderDetail,
      user,
      storeInfo,
      pagination: false,
      loading: loading.effects['deliveryOrderPacker/queryDetail']
        || loading.effects['deliveryOrderPacker/groupingDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/addItemByBarcode']
        || loading.effects['deliveryOrderPacker/saveDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/loadDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/deleteDeliveryOrderCartItem'],
      location
    }

    const onGrouping = () => {
      dispatch({
        type: 'deliveryOrderPacker/groupingDeliveryOrderCart'
      })
    }

    const onEnter = (event) => {
      const { value } = event.target
      if (value && value !== '') {
        if (value && value.toLowerCase() === 'g') {
          onGrouping()
          return
        }
        let orderQty = 1
        let barcode = value
        if (value && value.includes('*') && value.split('*').length === 2) {
          const splittedValue = value.split('*')
          if (splittedValue[0] && splittedValue[0].length < 8) {
            orderQty = parseFloat(splittedValue[0])
            if (!orderQty) {
              orderQty = 1
            }
            barcode = splittedValue[1]
          }
        }
        dispatch({
          type: 'deliveryOrderPacker/addItemByBarcode',
          payload: {
            orderQty,
            barcode
          }
        })
      }
    }

    const hotKeysHandler = {
      PRODUCT: () => {
        document.getElementById('input-product').focus()
      },
      GROUPING: () => {
        onGrouping()
      }
    }

    const onDeleteAll = () => {
      Modal.confirm({
        title: 'Delete all item in Scan Item',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'deliveryOrderPacker/deleteDeliveryOrderCart'
          })
        }
      })
    }

    const onSubmit = () => {
      dispatch({
        type: 'deliveryOrderPacker/showBoxNumberModal',
        payload: {
          detail: deliveryOrder
        }
      })
    }

    const modalBoxNumberProps = {
      visible: modalBoxNumberVisible,
      boxNumber: latestBoxNumber,
      loading,
      onOk (data) {
        Modal.confirm({
          title: 'Submit Transfer Out',
          content: 'Are you sure ?',
          onOk () {
            dispatch({
              type: 'deliveryOrderPacker/submitTransferOut',
              payload: data
            })
          }
        })
      },
      onCancel () {
        dispatch({
          type: 'deliveryOrderPacker/updateState',
          payload: {
            modalBoxNumberVisible: false,
            latestBoxNumber: 1
          }
        })
      }
    }

    if (currentItem && currentItem.storeId !== lstorage.getCurrentUserStore()) {
      return (
        <div className="content-inner">
          Please move to store {currentItem.storeName}
        </div>
      )
    }

    return (
      <div className="content-inner">
        <GlobalHotKeys
          keyMap={keyMap}
          handlers={hotKeysHandler}
        />
        {modalBoxNumberProps.visible && <ModalBoxNumber {...modalBoxNumberProps} />}
        <Row gutter={6}>
          <Col lg={10} md={24}>
            <h1 style={{ marginBottom: '10px' }}>Delivery Order</h1>
            <Collapse>
              <Panel header="Delivery Order Info" key="1">
                <ListDO {...listDOProps} />
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Requested Item" key="2">
                <ListOrder {...listOrderProps} />
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="List Transfer Out Detaiil" key="3">
                <ListTransferOutDetail {...listTransferOutDetailProps} />
              </Panel>
            </Collapse>
          </Col>
          <Col lg={14} md={24}>
            <h1>
              <span>
                Scan Item
                <Button type="primary" onClick={() => onGrouping()} style={{ marginLeft: '10px', marginBottom: '10px' }}>Grouping</Button>
              </span>
            </h1>
            <List {...listProps} />
          </Col>
        </Row>
        <Input
          id="input-product"
          size="large"
          autoFocus
          value={this.state.product}
          onChange={(event) => {
            this.setState({ product: event.target.value })
          }}
          style={{ fontSize: 24, marginBottom: 10, marginTop: 10 }}
          placeholder="Product (F2); ie. 2*Barcode | g to grouping"
          onPressEnter={(event) => {
            onEnter(event, 'barcode')
            this.setState({ product: '' })
          }}
        />

        <Row gutter={6}>
          <Col lg={10} md={24}>
            <Button
              size="large"
              style={{ width: '100%' }}
              type="danger"
              onClick={() => onDeleteAll()}
              disabled={
                loading.effects['deliveryOrderPacker/deleteDeliveryOrderCart']
                || loading.effects['deliveryOrderPacker/showBoxNumberModal']
              }
            >
              Cancel
            </Button>
          </Col>
          <Col lg={14} md={24}>
            <Button
              size="large"
              style={{ width: '100%' }}
              type="primary"
              onClick={() => onSubmit()}
              disabled={
                loading.effects['deliveryOrderPacker/deleteDeliveryOrderCart']
                || loading.effects['deliveryOrderPacker/showBoxNumberModal']
              }
            >
              Submit
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

DeliveryOrderPacker.propTypes = {
  deliveryOrderPacker: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
  transferOutDetail: PropTypes.object
}

export default connect(({ deliveryOrderPacker, transferOutDetail, deliveryOrder, loading, app }) => ({ deliveryOrderPacker, transferOutDetail, deliveryOrder, loading, app }))(DeliveryOrderPacker)
