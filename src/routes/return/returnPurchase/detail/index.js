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
import ModalEdit from './ModalEdit'
import TransDetail from './TransDetail'
import styles from './index.less'
import PrintPDFInvoice from './PrintPDFInvoice'


const Detail = ({ app, returnPurchase, returnPurchaseDetail, dispatch }) => {
  const { listDetail, data } = returnPurchase
  const { modalEditVisible, modalEditItem } = returnPurchaseDetail
  const {
    storeInfo,
    user
  } = app
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      if (typeof key === 'string' && key !== 'purchase' && key !== 'policeNoId' && key !== 'storeId' && key !== 'id' && key !== 'memberId') {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[key])}</div>
          </div>
        )
      }
      if (key && key === 'purchase' && data[key]) {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{data[key].transNo}</div>
          </div>
        )
      }
    }
  }

  const BackToList = () => {
    dispatch(routerRedux.push('/transaction/purchase/return?activeKey=1'))
  }

  const formDetailProps = {
    dataSource: listDetail,
    editList (item) {
      dispatch({
        type: 'returnPurchaseDetail/updateState',
        payload: {
          modalEditVisible: true,
          modalEditItem: item
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

  const modalEditProps = {
    visible: modalEditVisible,
    item: modalEditItem,
    onOk (item) {
      dispatch({
        type: 'returnPurchaseDetail/edit',
        payload: item
      })
    },
    onCancel () {
      dispatch({
        type: 'returnPurchaseDetail/updateState',
        payload: {
          modalEditItem: {},
          modalEditVisible: false
        }
      })
    }
  }

  return (<div className="wrapper">
    {modalEditVisible && <ModalEdit {...modalEditProps} />}
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
  returnPurchase: PropTypes.object,
  returnPurchaseDetail: PropTypes.object
}

export default connect(({ app, returnPurchase, returnPurchaseDetail }) => ({ app, returnPurchase, returnPurchaseDetail }))(Detail)
