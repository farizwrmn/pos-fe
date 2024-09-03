import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Tag, Button } from 'antd'
import ModalPayment from './Modal'
import ModalCancel from './ModalCancel'
import FormPayment from './FormPayment'
import FormAccounting from './FormAccounting'
import TransDetail from './TransDetail'
import styles from './index.less'

const Detail = ({ app, loading, paymentDetail, paymentEdc, paymentCost, paymentOpts, dispatch }) => {
  const { user } = app
  const { listDetail, listAccounting, itemCancel, modalCancelVisible, modalVisible, listAmount, data } = paymentDetail
  const {
    paymentLov: listAllEdc,
    paymentLovFiltered: listEdc
  } = paymentEdc
  const {
    paymentLov: listAllCost,
    paymentLovFiltered: listCost
  } = paymentCost
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
    dispatch,
    width: '68%',
    data,
    listAllEdc,
    listAllCost,
    listEdc,
    listCost,
    listAmount,
    options: listOpts,
    visible: modalVisible,
    loading,
    onOk (e) {
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
    dispatch(routerRedux.push('/accounts/payment?activeKey=1'))
  }

  const modalCancelProps = {
    data,
    item: itemCancel,
    loading,
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
    listAccounting,
    listAmount,
    loading,
    openModal (e) {
      dispatch({
        type: 'paymentDetail/updateState',
        payload: {
          [e]: true
        }
      })
      console.log('openModal')
      dispatch({
        type: 'paymentEdc/updateState',
        payload: {
          paymentLovFiltered: listAllEdc.filter(filtered => filtered.paymentOption === 'C')
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
            {parseFloat(data.length > 0 ? data[0].nettoTotal || 0 : 0) - parseFloat(curPayment || 0) === parseFloat(data.length > 0 ? data[0].nettoTotal || 0 : 0) ? 'Pending' :
              parseFloat(data[0].nettoTotal || 0) - parseFloat(curPayment || 0) <= 0 ? 'Paid' : 'Partial'}
          </Tag>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <FormPayment {...formProps} />
          </Row>
        </div>
        {(user.permissions.role === 'OWN'
          || user.permissions.role === 'SPR'
          || user.permissions.role === 'HFC'
          || user.permissions.role === 'SFC') && (
            <div className="content-inner-zero-min-height">
              <h1>Accounting Journal</h1>
              <Row style={{ padding: '10px', margin: '4px' }}>
                <FormAccounting {...formProps} />
              </Row>
            </div>
          )}
      </Col>
    </Row>
    {modalCancelVisible && <ModalCancel {...modalCancelProps} />}
    {modalVisible && <ModalPayment {...modalProps} />}
  </div>)
}

Detail.propTypes = {
  app: PropTypes.object.isRequired,
  paymentDetail: PropTypes.object.isRequired,
  paymentOpts: PropTypes.object.isRequired,
  pos: PropTypes.object.isRequired
}

export default connect(({ app, paymentDetail, paymentEdc, paymentCost, pos, paymentOpts, dispatch, loading }) => ({ app, paymentDetail, paymentEdc, paymentCost, pos, paymentOpts, dispatch, loading }))(Detail)
