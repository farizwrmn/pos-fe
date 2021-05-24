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
import styles from './index.less'


const Detail = ({ returnPurchase, dispatch }) => {
  const { listDetail, data } = returnPurchase
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
    dataSource: listDetail
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
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
      </Col>
    </Row>
  </div>)
}

Detail.propTypes = {
  returnPurchase: PropTypes.object
}

export default connect(({ returnPurchase }) => ({ returnPurchase }))(Detail)
