import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col } from 'antd'
import Form from './Form'
import List from './List'
import {
  generateListBank
} from './utils'

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
    listPayment,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `paymentCost/${modalType}`,
        payload: data
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
