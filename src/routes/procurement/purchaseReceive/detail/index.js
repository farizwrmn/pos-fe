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


const Detail = ({ app, purchaseReceive, dispatch }) => {
  const { user, storeInfo } = app
  const { listItem, data } = purchaseReceive
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

  const formDetailProps = {
    dataSource: listItem
  }

  const printProps = {
    // listItem: listProducts,
    // itemPrint: transHeader,
    // itemHeader: transHeader,
    listItem,
    itemPrint: data,
    itemHeader: data,
    storeInfo,
    user,
    printNo: 1
  }

  return (
    <div className="wrapper">
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
            {listItem && listItem.length > 0 ? <PrintPDFInvoice {...printProps} /> : null}
            <h1>Purchase Receive Items</h1>
            <Row style={{ padding: '10px', margin: '4px' }}>
              <TransDetail {...formDetailProps} />
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

Detail.propTypes = {
  app: PropTypes.object,
  purchaseReceive: PropTypes.object
}

export default connect(({ app, loading, purchaseReceive }) => ({ app, loading, purchaseReceive }))(Detail)
