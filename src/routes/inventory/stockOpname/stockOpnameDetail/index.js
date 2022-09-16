import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Row,
  Col,
  Tag,
  Spin,
  Button
} from 'antd'
import TransDetail from './TransDetail'
import styles from './index.less'


const Detail = ({ stockOpname, dispatch }) => {
  const { listDetail, detailData, detailPagination } = stockOpname
  const content = []
  for (let key in detailData) {
    if ({}.hasOwnProperty.call(detailData, key)) {
      if (key !== 'policeNoId' && key !== 'storeId' && key !== 'id' && key !== 'memberId') {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(detailData[key])}</div>
          </div>
        )
      }
    }
  }

  const getTag = (record) => {
    if (record.status === 1) {
      return <Tag color="green">Finish</Tag>
    }
    return <Tag color="yellow">In Progress</Tag>
  }

  if (!detailData.id) {
    return <Spin size="large" />
  }

  const BackToList = () => {
    dispatch(routerRedux.push('/stock-opname?activeKey=0'))
  }

  const formDetailProps = {
    dataSource: listDetail,
    pagination: detailPagination
  }

  return (<div className="wrapper">
    <Row>
      <Col lg={8}>
        <div className="content-inner-zero-min-height">
          <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
          <h1>Detail Info</h1>
          <div className={styles.content}>
            <Row>
              <Col span={12}><strong>STORE</strong></Col>
              <Col span={12}><strong>{detailData && detailData.store ? detailData.store.storeName : ''}</strong></Col>
            </Row>
            <Row>
              <Col span={12}>BATCH NUMBER</Col>
              <Col span={12}>{`Phase ${detailData && detailData.activeBatch ? detailData.activeBatch.batchNumber : ''}`}</Col>
            </Row>
            <Row>
              <Col span={12}>Status</Col>
              <Col span={12}>{getTag(detailData)}</Col>
            </Row>
          </div>
        </div>
      </Col>
      <Col lg={24}>
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
  loading: PropTypes.object,
  app: PropTypes.object,
  stockOpname: PropTypes.object
}

export default connect(({ loading, app, stockOpname }) => ({ loading, app, stockOpname }))(Detail)
