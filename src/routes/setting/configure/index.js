import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Card, Modal } from 'antd'
import { DropOption } from 'components'
import Inventory from './inventory'
import Company from './company'

const Config = ({ dispatch, configure, loading }) => {
  const { formHeader, formCompanyVisible, formInventoryVisible, config, visibilitySave, visibilityCommit } = configure
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
              data
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

  const companyProps = {
    formHeader,
    visible: formCompanyVisible,
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
              data
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

  const clearLocal = () => {
    Modal.confirm({
      title: 'All local memory will delete',
      content: 'Are you sure?',
      onOk () {
        localStorage.clear()
      }
    })
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
            {formCompanyVisible && <Company {...companyProps} />}
          </Card>
        </Col>
        <Col lg={{ span: 3, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 24 }}>
          <Button type="primary" onClick={clearLocal} style={{ marginBottom: '10px' }}>Clear Local</Button>
          <DropOption onMenuClick={e => hdlDropOptionClick(e)}
            menuName="Options"
            menuOptions={[
              { key: 'Inventory', name: 'Inventory' },
              { key: 'Company', name: 'Company' }
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
  loading: PropTypes.object
}

export default connect(({ configure, loading }) => ({ configure, loading }))(Config)
