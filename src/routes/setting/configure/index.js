import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tab, Row, Col, Menu, Dropdown, Button, Icon, Card } from 'antd'
import { DropOption } from 'components'
import Inventory from './inventory'
import Payment from './payment'

const Config = ({ location, dispatch, configure, customer, loading }) => {
  const { formHeader, formInventoryVisible, formPaymentVisible, config, visibility } = configure
  const inventoryProps = {
    formHeader,
    visible: formInventoryVisible,
    config,
    visibility,
    onOk (id, data) {
      dispatch({
        type: 'configure/update',
        payload: {
          id,
          data: data
        }
      })
    },
    changeVisible (e, formHeader) {
      dispatch({
        type: 'configure/saveVisible',
        payload: {
          visible: e,
          formHeader
        }
      })
    }
  }

  const paymentProps = {
    visible: formPaymentVisible
  }

  const hdlDropOptionClick = (e) => {
    dispatch({
      type: 'configure/close'
    })
    dispatch({
      type: 'configure/query',
      payload: {
        formHeader: e.key
      }
    })
  }

  return (
    <div className="content-inner">
      <Row>
        <Col lg={{ span: 19, offset: 1 }} md={{ span: 19, offset: 1 }} sm={{ span: 24 }}>
          <Card title={formHeader}>
            {formInventoryVisible && <Inventory {...inventoryProps}/>}
            {formPaymentVisible && <Payment />}
          </Card>
        </Col>
        <Col lg={{ span: 3, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 24 }}>
          <DropOption onMenuClick={e => hdlDropOptionClick(e)}
            menuName="Options"
            menuOptions={[
              { key: 'Inventory', name: 'Inventory' },
              { key: 'Payment', name: 'Payment' }
            ]}
          />
        </Col>
      </Row>
    </div>
  )
}

Config.propTypes = {
  configure: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ configure, loading }) => ({ configure, loading }))(Config)