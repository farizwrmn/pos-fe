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
import TransDetail from './TransDetail'
import FormAccounting from './FormAccounting'
import styles from './index.less'
import ModalPayment from './ModalPayment'


const Detail = ({ voucherdetail, accountCode, dispatch }) => {
  const { listDetail, listAccounting, visiblePayment, data, selectedRowKeys } = voucherdetail
  const { listAccountCodeLov } = accountCode
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

  const BackToList = () => {
    dispatch(routerRedux.push('/marketing/voucher?activeKey=1'))
  }

  const formDetailProps = {
    dataSource: listDetail,
    rowSelection: {
      selectedRowKeys,
      getCheckboxProps: record => ({
        disabled: record.voucherPayment // Column configuration not to be checked
      }),
      onChange: (keys) => {
        dispatch({
          type: 'voucherdetail/updateState',
          payload: {
            selectedRowKeys: keys
          }
        })
      }
    },
    onSelectAll () {
      if (selectedRowKeys.length === listDetail.filter(filtered => !filtered.voucherPayment).length) {
        dispatch({
          type: 'voucherdetail/updateState',
          payload: {
            selectedRowKeys: []
          }
        })
      } else {
        dispatch({
          type: 'voucherdetail/updateState',
          payload: {
            selectedRowKeys: listDetail.filter(filtered => !filtered.voucherPayment)
              .map(item => item.no)
          }
        })
      }
    },
    onPayment () {
      dispatch({
        type: 'voucherdetail/updateState',
        payload: {
          visiblePayment: true
        }
      })
    }
  }

  const modalPaymentProps = {
    visible: selectedRowKeys.length > 0 && visiblePayment,
    selectedRowKeysLen: selectedRowKeys.length,
    listAccountCode: listAccountCodeLov,
    onOk (data, reset) {
      dispatch({
        type: 'voucherdetail/paymentVoucher',
        payload: {
          data,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'voucherdetail/updateState',
        payload: {
          visiblePayment: false
        }
      })
    }
  }

  return (<div className="wrapper">
    <ModalPayment {...modalPaymentProps} />
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
          <h1>Accounting Journal</h1>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <FormAccounting listAccounting={listAccounting} />
          </Row>
        </div>
      </Col>
    </Row>
  </div>)
}

Detail.propTypes = {
  accountCode: PropTypes.object,
  voucherdetail: PropTypes.object
}

export default connect(({ voucherdetail, accountCode }) => ({ voucherdetail, accountCode }))(Detail)
