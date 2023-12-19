import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Row,
  Col,
  Button,
  Modal
} from 'antd'
import TransDetail from './TransDetail'
import styles from './index.less'
import PrintPDFInvoice from './PrintPDFInvoice'
import PurchaseReceiveList from './PurchaseReceiveList'
import PrintPDFInvoicePrice from './PrintPDFInvoicePrice'


const Detail = ({ app, loading, purchaseOrder, dispatch }) => {
  const { user, storeInfo } = app
  const { listDetail, listPurchaseReceive, data } = purchaseOrder
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
    dispatch(routerRedux.push('/transaction/procurement/order-history'))
  }

  const onFinished = (id) => {
    Modal.confirm({
      title: 'Update Transaction',
      content: 'are you sure ?',
      onOk () {
        dispatch({
          type: 'purchaseOrder/updateFinish',
          payload: {
            id
          }
        })
      },
      onCancel () {

      }
    })
  }

  const onCancel = (id) => {
    Modal.confirm({
      title: 'Cancel Transaction',
      content: 'this action cannot be undone, are you sure ?',
      onOk () {
        dispatch({
          type: 'purchaseOrder/updateCancel',
          payload: {
            id
          }
        })
      },
      onCancel () {

      }
    })
  }

  const formDetailProps = {
    dataSource: listDetail
  }

  const formReceiveProps = {
    dataSource: listPurchaseReceive
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
          {listDetail && listDetail.length && <PrintPDFInvoice {...printProps} />}
          {listDetail && listDetail.length && <PrintPDFInvoicePrice {...printProps} />}
          {listPurchaseReceive && listPurchaseReceive.length > 0 ? <Button type="primary" icon="check" disabled={loading.effects['purchaseOrder/updateFinish']} onClick={() => onFinished(data.id)}>Finished</Button> : null}
          {listPurchaseReceive && listPurchaseReceive.length === 0 ? <Button type="danger" icon="close" disabled={loading.effects['purchaseOrder/updateCancel']} onClick={() => onCancel(data.id)}>Cancel</Button> : null}
          <h1>Purchase Receive List</h1>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <PurchaseReceiveList {...formReceiveProps} />
          </Row>
          <h1>Purchase Order Items</h1>
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
      </Col>
    </Row>
  </div>)
}

Detail.propTypes = {
  app: PropTypes.object,
  purchaseOrder: PropTypes.object
}

export default connect(({ app, loading, purchaseOrder }) => ({ app, loading, purchaseOrder }))(Detail)
