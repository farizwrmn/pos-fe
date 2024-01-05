import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Col, Collapse, Input, Row } from 'antd'
import { GlobalHotKeys } from 'react-hotkeys'
import List from './List'
import ListOrder from './ListOrder'

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
    const { deliveryOrderPacker, loading, dispatch, location, app } = this.props
    const { listItem, deliveryOrder } = deliveryOrderPacker
    const { user, storeInfo } = app

    const listProps = {
      dataSource: listItem,
      user,
      storeInfo,
      pagination: false,
      loading: loading.effects['deliveryOrderPacker/queryDetail']
        || loading.effects['deliveryOrderPacker/groupingDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/addItemByBarcode'],
      location
    }

    const listOrderProps = {
      dataSource: deliveryOrder.deliveryOrderDetail,
      user,
      storeInfo,
      pagination: false,
      loading: loading.effects['deliveryOrderPacker/queryDetail']
        || loading.effects['deliveryOrderPacker/groupingDeliveryOrderCart']
        || loading.effects['deliveryOrderPacker/addItemByBarcode'],
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
          if (splittedValue[0] && splittedValue[0].length < 4) {
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

    return (
      <div className="content-inner">
        <GlobalHotKeys
          keyMap={keyMap}
          handlers={hotKeysHandler}
        />
        <Input
          id="input-product"
          size="medium"
          autoFocus
          value={this.state.product}
          onChange={(event) => {
            this.setState({ product: event.target.value })
          }}
          style={{ fontSize: 24, marginBottom: 8 }}
          placeholder="Product (F2); ie. 2*Barcode"
          onPressEnter={(event) => {
            onEnter(event, 'barcode')
            this.setState({ product: '' })
          }}
        />
        <Row>
          <Col span={14}>
            <h1>
              <span>
                Scan Item
                <Button type="primary" onClick={() => onGrouping()} style={{ marginLeft: '10px', marginBottom: '10px' }}>Grouping</Button>
              </span>
            </h1>
            <List {...listProps} />
          </Col>
          <Col span={10}>
            <Collapse style={{ marginTop: '46px' }}>
              <Panel header="Requested Item" key="1">
                <ListOrder {...listOrderProps} />
              </Panel>
            </Collapse>
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
  dispatch: PropTypes.func
}

export default connect(({ deliveryOrderPacker, loading, app }) => ({ deliveryOrderPacker, loading, app }))(DeliveryOrderPacker)
