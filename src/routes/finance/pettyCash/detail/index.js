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

const Detail = ({ pettyCashDetail, app, dispatch }) => {
  const { listDetail, listAccounting, listDetailTrans, data } = pettyCashDetail
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
    dispatch(routerRedux.push('/balance/finance/petty-cash?activeKey=1'))
  }

  const formDetailProps = {
    storeInfo,
    user,
    dataSource: listDetail,
    listDetailTrans,
    data
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

        {(user.permissions.role === 'OWN' || user.permissions.role === 'SPR' || user.permissions.role === 'ADM') && (
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
  pettyCashDetail: PropTypes.object
}

export default connect(({ app, pettyCashDetail }) => ({ app, pettyCashDetail }))(Detail)
