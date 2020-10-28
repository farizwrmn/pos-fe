import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Row,
  Col,
  // Tag,
  Button
} from 'antd'
import { DataAdd } from 'components'
import ModalPayment from './Modal'
import ModalCancel from './ModalCancel'
import FormPayment from './FormPayment'
import TransDetail from './TransDetail'
import styles from './index.less'

const { SupplierBank } = DataAdd

const Detail = ({ paymentEdc, app, paymentCost, payableDetail, bank, supplierBank, paymentOpts, dispatch }) => {
  const { user } = app
  const {
    listPayment: listEdc
  } = paymentEdc
  const {
    listPayment: listCost
  } = paymentCost
  const { listDetail, visibleTooltip, valueNumber, itemCancel, modalCancelVisible, modalVisible, listAmount, data } = payableDetail
  const { listOpts } = paymentOpts
  const { listSupplierBank, modalAddBankVisible } = supplierBank
  const { listBank } = bank
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      if (key !== 'policeNoId' && key !== 'storeId' && key !== 'id' && key !== 'memberId') {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[key])}</div>
          </div>
        )
      }
    }
  }

  const modalProps = {
    width: '68%',
    user,
    data,
    listAmount,
    visibleTooltip,
    listSupplierBank,
    valueNumber,
    options: listOpts,
    visible: modalVisible,
    listEdc,
    listCost,
    onGetCost (machineId) {
      dispatch({
        type: 'paymentCost/query',
        payload: {
          machineId,
          relationship: 1
        }
      })
    },
    onGetMachine (paymentOption) {
      dispatch({
        type: 'paymentEdc/query',
        payload: {
          paymentOption
        }
      })
    },
    onResetMachine () {
      dispatch({
        type: 'paymentEdc/updateState',
        payload: {
          listPayment: []
        }
      })
      dispatch({
        type: 'paymentCost/updateState',
        payload: {
          listPayment: []
        }
      })
    },
    onOk (e) {
      dispatch({
        type: 'payableDetail/updateState',
        payload: {
          modalVisible: false
        }
      })
      dispatch({
        type: 'payableDetail/add',
        payload: {
          data: e
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'payableDetail/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    changeVisibleTooltip (value) {
      dispatch({
        type: 'payableDetail/updateState',
        payload: {
          visibleTooltip: value
        }
      })
    },
    changeValueNumber (value) {
      dispatch({
        type: 'payableDetail/updateState',
        payload: {
          valueNumber: value
        }
      })
    },
    showAddBank () {
      dispatch({
        type: 'payableDetail/updateState',
        payload: {
          modalVisible: false
        }
      })
      dispatch({
        type: 'supplierBank/updateState',
        payload: {
          modalAddBankVisible: true
        }
      })
      dispatch({
        type: 'bank/query',
        payload: {
          type: 'all',
          field: 'id,bankCode,bankName'
        }
      })
    }
  }

  const BackToList = () => {
    dispatch(routerRedux.push('/accounts/payable'))
  }

  const modalCancelProps = {
    data,
    item: itemCancel,
    visible: modalCancelVisible,
    onOk (e) {
      dispatch({
        type: 'payableDetail/cancelPayment',
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
        type: 'payableDetail/updateState',
        payload: {
          modalCancelVisible: false
        }
      })
    }
  }

  const formProps = {
    data,
    listAmount,
    openModal () {
      dispatch({
        type: 'payableDetail/updateState',
        payload: {
          modalVisible: true
        }
      })
      dispatch({
        type: 'supplierBank/querySupplier',
        payload: {
          id: data.supplierCode
        }
      })
    },
    cancelPayment (e) {
      dispatch({
        type: 'payableDetail/updateState',
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
  const modalBankProps = {
    supplierData: data,
    listBank,
    visible: modalAddBankVisible,
    onCancel () {
      dispatch({
        type: 'payableDetail/updateState',
        payload: {
          modalVisible: true
        }
      })
      dispatch({
        type: 'supplierBank/updateState',
        payload: {
          modalAddBankVisible: false
        }
      })
    }
  }

  // const curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.paid), 0)
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
          {/* <Tag color={parseFloat(data.length > 0 ? data.nettoTotal || 0 : 0) - parseFloat(curPayment || 0) === parseFloat(data.length > 0 ? data.nettoTotal || 0 : 0) ? 'red' : parseFloat(data.nettoTotal || 0) - parseFloat(curPayment || 0) <= 0 ? 'green' : 'yellow'}>
            {parseFloat(data.length > 0 ? data.nettoTotal || 0 : 0) - parseFloat(curPayment || 0) === parseFloat(data.length > 0 ? data.nettoTotal || 0 : 0) ? 'Pending' :
              parseFloat(data.nettoTotal || 0) - parseFloat(curPayment || 0) <= 0 ? 'Paid' : 'Partial'}
          </Tag> */}
          <Row style={{ padding: '10px', margin: '4px' }}>
            <FormPayment {...formProps} />
          </Row>
        </div>
      </Col>
    </Row>
    {modalCancelVisible && <ModalCancel {...modalCancelProps} />}
    {modalVisible && <ModalPayment {...modalProps} />}
    {modalAddBankVisible && <SupplierBank {...modalBankProps} />}
  </div>)
}

Detail.propTypes = {
  app: PropTypes.object,
  payableDetail: PropTypes.object,
  bank: PropTypes.object.isRequired,
  supplierBank: PropTypes.object.isRequired,
  paymentOpts: PropTypes.object
}

export default connect(({ bank, app, paymentEdc, paymentCost, supplierBank, payableDetail, paymentOpts, dispatch, loading }) => ({ bank, app, paymentEdc, paymentCost, supplierBank, payableDetail, paymentOpts, dispatch, loading }))(Detail)
