import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button } from 'antd'
import {
  generateListBank
} from 'utils/payment'
import Form from './Form'
import List from './List'

const Counter = ({
  paymentCost,
  bank,
  loading,
  dispatch,
  location,
  app
}) => {
  const { listPayment, pagination, modalType, currentItem } = paymentCost
  const { listBank } = bank
  const { user, storeInfo } = app

  const listProps = {
    dataSource: generateListBank(listBank, listPayment),
    user,
    storeInfo,
    pagination,
    loading: loading.effects['paymentCost/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    editItem (item) {
      dispatch({
        type: 'paymentCost/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'paymentCost/delete',
        payload: id
      })
    }
  }

  const formProps = {
    modalType,
    item: currentItem,
    disabled: loading.effects['paymentCost/query'] || (currentItem && !currentItem.id),
    button: 'Update',
    onSubmit (data) {
      const { pathname } = location
      const match = pathToRegexp('/master/paymentoption/cost/:id').exec(pathname)
      dispatch({
        type: 'paymentCost/add',
        payload: {
          ...data,
          bankId: currentItem ? currentItem.id : null,
          machineId: match[1]
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'paymentCost/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Row>
        <Col>
          <Button type="primary" icon="rollback" onClick={() => { dispatch(routerRedux.goBack()) }}>Back</Button>
        </Col>
      </Row>
      <Row>
        <Col md={24} lg={12}>
          <Form {...formProps} />
        </Col>
        <Col md={24} lg={12}>
          <List {...listProps} />
        </Col>
      </Row>
    </div>
  )
}

Counter.propTypes = {
  paymentCost: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  paymentCost,
  bank,
  loading,
  app
}) => ({
  paymentCost,
  bank,
  loading,
  app
}))(Counter)
