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
import PrintPDF from './PrintPDF'
import PrintPDFOnlyQty from './PrintPDFOnlyQty'


const Detail = ({ adjustDetail, app, dispatch }) => {
  const { listDetail, listAccounting, data } = adjustDetail
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
    dispatch(routerRedux.push('/transaction/product-waste?activeKey=1'))
  }

  const formDetailProps = {
    dataSource: listDetail
  }

  const printProps = {
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
          <PrintPDF {...printProps} />
          <PrintPDFOnlyQty {...printProps} />
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
        {(user.permissions.role === 'OWN'
          || user.permissions.role === 'ITS'
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
  adjustDetail: PropTypes.object
}

export default connect(({ app, adjustDetail }) => ({ app, adjustDetail }))(Detail)
