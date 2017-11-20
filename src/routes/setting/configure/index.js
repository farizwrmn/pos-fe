import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tab, Row, Col, Menu, Dropdown, Button, Icon, Card, Modal } from 'antd'
import { DropOption } from 'components'
import Inventory from './inventory'

const Config = ({ location, dispatch, configure, customer, loading }) => {
  const { formHeader, formInventoryVisible, config, visibilitySave, visibilityCommit } = configure
  const inventoryProps = {
    formHeader,
    visible: formInventoryVisible,
    config,
    visibilitySave,
    visibilityCommit,
    loading: loading.effects['configure/query'],
    onOk (id, data) {
      Modal.confirm({
        title: 'Change Preference',
        content: 'this action cannot be undone',
        onOk () {
          dispatch({
            type: 'configure/update',
            payload: {
              id,
              data: data
            }
          })
        }
      })
    },
    changeVisible (e, formHeader) {
      dispatch({
        type: 'configure/saveVisible',
        payload: {
          visibilitySave: e,
          formHeader
        }
      })
    }
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
            {formInventoryVisible && <Inventory {...inventoryProps} />}
          </Card>
        </Col>
        <Col lg={{ span: 3, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 24 }}>
          <DropOption onMenuClick={e => hdlDropOptionClick(e)}
            menuName="Options"
            menuOptions={[
              { key: 'Inventory', name: 'Inventory' },
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