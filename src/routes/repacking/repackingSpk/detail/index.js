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
import TransMaterial from './TransMaterial'
import styles from './index.less'
import PrintPDFInvoice from './PrintPDFInvoice'
import PrintPDFMaterial from './PrintPDFMaterial'


const Detail = ({ app, repackingSpk, dispatch }) => {
  const { user, storeInfo } = app
  const { listDetail, data, materialRequest } = repackingSpk
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
    dispatch(routerRedux.push('/repacking-spk?activeKey=1'))
  }

  const formDetailProps = {
    materialRequest,
    dataSource: listDetail && listDetail.map((item, index) => ({ no: index + 1, ...item }))
  }

  const formMaterialProps = {
    dataSource: materialRequest && materialRequest.map((item, index) => ({ no: index + 1, ...item }))
  }

  const printProps = {
    listItem: listDetail,
    materialRequest,
    itemPrint: data,
    itemHeader: data,
    storeInfo,
    user,
    printNo: 1
  }

  const printMaterialProps = {
    listItem: materialRequest,
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
          <h1>Request</h1>
          {listDetail && listDetail.length ? <PrintPDFInvoice {...printProps} /> : null}
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>

        <div className="content-inner-zero-min-height" style={{ marginTop: '10px' }}>
          <h1>Material</h1>
          {materialRequest && materialRequest.length ? <PrintPDFMaterial {...printMaterialProps} /> : null}
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransMaterial {...formMaterialProps} />
          </Row>
        </div>
      </Col>
    </Row>
  </div>)
}

Detail.propTypes = {
  app: PropTypes.object,
  repackingSpk: PropTypes.object
}

export default connect(({ app, repackingSpk }) => ({ app, repackingSpk }))(Detail)
