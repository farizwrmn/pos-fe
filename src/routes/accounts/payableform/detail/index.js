import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Row,
  Col,
  Modal,
  // Tag,
  Button
} from 'antd'
import { prefix } from 'utils/config.main'
import moment from 'moment'
import TransDetail from './TransDetail'
import styles from './index.less'
import PrintPDFInvoice from './PrintPDFInvoice'
import ModalCancel from './ModalCancel'


const Detail = ({ payableForm, loading, app, dispatch }) => {
  const { listDetail, data, modalCancelVisible } = payableForm
  const { user, storeInfo } = app
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
    dispatch(routerRedux.push('/accounts/payable-form?activeKey=1'))
  }

  const formDetailProps = {
    dataSource: listDetail
  }

  const voidTrans = () => {
    dispatch({
      type: 'payableForm/updateState',
      payload: {
        modalCancelVisible: true
      }
    })
  }

  const modalCancelProps = {
    data,
    item: data,
    visible: modalCancelVisible,
    onOk (e) {
      Modal.confirm({
        title: 'Are you sure void this Invoice?',
        onOk () {
          const startPeriod = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)).startPeriod : {}
          const formattedStartPeriod = moment(startPeriod).format('YYYY-MM-DD')
          if (moment(data.transDate).format('YYYY-MM-DD') >= formattedStartPeriod) {
            dispatch({
              type: 'payableForm/voidTrans',
              payload: {
                id: data.id,
                memo: e.memo
              }
            })
          } else {
            Modal.warning({
              title: 'Can`t Void this Invoice',
              content: 'has been Closed'
            })
          }
        },
        onCancel () {
          console.log('no')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferInDetail/updateState',
        payload: {
          modalCancelVisible: false
        }
      })
    }
  }

  const printProps = {
    // listItem: listProducts,
    // itemPrint: transHeader,
    // itemHeader: transHeader,
    listItem: listDetail,
    itemPrint: data,
    itemHeader: data,
    storeInfo,
    user,
    printNo: 1
  }

  return (<div className="wrapper">
    <Row>
      {modalCancelVisible && <ModalCancel {...modalCancelProps} />}
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
          {listDetail && listDetail.length && <PrintPDFInvoice {...printProps} />}
          <Button type="danger" icon="delete" disabled={loading.effects['payableForm/voidTrans']} onClick={() => voidTrans(data.id)}>Void</Button>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
      </Col>
    </Row>
  </div>)
}

Detail.propTypes = {
  loading: PropTypes.object,
  payableForm: PropTypes.object
}

export default connect(({
  app,
  loading,
  payableForm
}) => ({
  app,
  loading,
  payableForm
}))(Detail)
