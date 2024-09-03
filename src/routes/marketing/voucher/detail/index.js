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
import PrintXLS from './PrintXLS'


const Detail = ({ app, loading, voucherdetail, accountRule, dispatch }) => {
  const { user, storeInfo } = app
  const { listDetail, listAccounting, visiblePayment, data, selectedRowKeys } = voucherdetail
  const { listAccountCodeLov } = accountRule
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
    item: data,
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
    loading,
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

  const printProps = {
    user,
    storeInfo
  }

  return (<div className="wrapper">
    {selectedRowKeys.length > 0 && visiblePayment && <ModalPayment {...modalPaymentProps} />}
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
          {listDetail && listDetail.length > 0 && <PrintXLS header={data} data={listDetail} name="Export Code" {...printProps} />}
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
        {(user.permissions.role === 'OWN'
          || user.permissions.role === 'SPR'
          || user.permissions.role === 'HPC'
          || user.permissions.role === 'SPC'
          || user.permissions.role === 'HFC'
          || user.permissions.role === 'SFC') && (
            <div className="content-inner-zero-min-height">
              <h1>Accounting Journal</h1>
              <Row style={{ padding: '10px', margin: '4px' }}>
                <FormAccounting listAccounting={listAccounting} />
              </Row>
            </div>
          )}
      </Col>
    </Row>
  </div>)
}

Detail.propTypes = {
  app: PropTypes.object,
  loading: PropTypes.object,
  accountRule: PropTypes.object,
  voucherdetail: PropTypes.object
}

export default connect(({ app, loading, voucherdetail, accountRule }) => ({ app, loading, voucherdetail, accountRule }))(Detail)
