import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Row,
  Col,
  Button
} from 'antd'
import TransDetail from './TransDetail'
import styles from './index.less'
import PrintPDFInvoice from './PrintPDFInvoice'


const Detail = ({ app, purchaseOrder, dispatch }) => {
  const { user, storeInfo } = app
  const { listDetail, data } = purchaseOrder
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
    dispatch(routerRedux.push('/transaction/procurement/order'))
  }

  const formDetailProps = {
    dataSource: listDetail
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
          <h1>Items</h1>
          {listDetail && listDetail.length && <PrintPDFInvoice {...printProps} />}
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

export default connect(({ app, purchaseOrder }) => ({ app, purchaseOrder }))(Detail)
