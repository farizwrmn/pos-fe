import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Tag, Button } from 'antd'
import ModalPayment from './Modal'
import ModalCancel from './ModalCancel'
import FormPayment from './FormPayment'
import TransDetail from './TransDetail'
import styles from './index.less'

const Detail = ({ paymentDetail, paymentOpts, dispatch }) => {
  const { listDetail, itemCancel, modalCancelVisible, modalVisible, listAmount, data } = paymentDetail
  const { listOpts } = paymentOpts
  const content = []
  for (let key in data[0]) {
    if ({}.hasOwnProperty.call(data[0], key)) {
      if (key !== 'policeNoId' && key !== 'storeId' && key !== 'id' && key !== 'memberId') {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[0][key])}</div>
          </div>
        )
      }
    }
  }

  const modalProps = {
    width: '68%',
    data,
    listAmount,
    options: listOpts,
    visible: modalVisible,
    onOk (e) {
      dispatch({
        type: 'paymentDetail/updateState',
        payload: {
          modalVisible: false
        }
      })
      dispatch({
        type: 'paymentDetail/add',
        payload: {
          data: e
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'paymentDetail/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const BackToList = () => {
    dispatch(routerRedux.push('/accounts/payment'))
  }

  const modalCancelProps = {
    data,
    item: itemCancel,
    visible: modalCancelVisible,
    onOk (e) {
      dispatch({
        type: 'paymentDetail/cancelPayment',
        payload: {
          id: e.id,
          storeId: e.storeId,
          transNo: e.transNo,
          memo: e.memo
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'paymentDetail/updateState',
        payload: {
          modalCancelVisible: false
        }
      })
    }
  }

  const formProps = {
    data,
    listAmount,
    openModal (e) {
      dispatch({
        type: 'paymentDetail/updateState',
        payload: {
          [e]: true
        }
      })
    },
    cancelPayment (e) {
      dispatch({
        type: 'paymentDetail/updateState',
        payload: {
          modalCancelVisible: true,
          itemCancel: e
        }
      })
    }
  }
  const formDetailProps = {
    dataSource: listDetail
  }

  const curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.paid), 0)

  return (<div className="wrapper">
    <Row>
      <Col lg={6}>
        <div className="content-inner-zero-min-height">
          <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
          <h1>Invoice Info</h1>
          <div className={styles.content}>
            {content}
          </div>
        </div>
      </Col>
      <Col lg={18}>
        <div className="content-inner-zero-min-height">
          <h1>Items</h1>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
        <div className="content-inner-zero-min-height">
          <h1>Payment</h1>
          <Tag color={parseFloat(data.length > 0 ? data[0].nettoTotal || 0 : 0) - parseFloat(curPayment || 0) === parseFloat(data.length > 0 ? data[0].nettoTotal || 0 : 0) ? 'red' : parseFloat(data[0].nettoTotal || 0) - parseFloat(curPayment || 0) <= 0 ? 'green' : 'yellow'}>
            {parseFloat(data.length > 0 ? data[0].nettoTotal || 0 : 0) - parseFloat(curPayment || 0) === parseFloat(data.length > 0 ? data[0].nettoTotal || 0 : 0) ? 'Pending' : parseFloat(data[0].nettoTotal || 0) - parseFloat(curPayment || 0) <= 0 ? 'Paid' : 'Partial'}
          </Tag>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <FormPayment {...formProps} />
          </Row>
        </div>
      </Col>
    </Row>
    <ModalCancel {...modalCancelProps} />
    <ModalPayment {...modalProps} />
  </div>)
}

Detail.propTypes = {
  paymentDetail: PropTypes.object,
  paymentOpts: PropTypes.object
}

export default connect(({ paymentDetail, paymentOpts, dispatch, loading }) => ({ paymentDetail, paymentOpts, dispatch, loading }))(Detail)
