import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import styles from './index.less'

const Detail = ({ productBookmarkDetail }) => {
  const data = productBookmarkDetail.data
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      content.push(<div key={key} className={styles.item}>
        <div>{key}</div>
        <div>{String(data[key])}</div>
      </div>)
    }
  }
  return (<div className="content-inner">
    <div className={styles.content}>
      <Row>
        <Col md={24} lg={12}>
          {content}
        </Col>
        <Col md={24} lg={12}>
          {content}
        </Col>
      </Row>
    </div>
  </div>)
}

Detail.propTypes = {
  productBookmarkDetail: PropTypes.object
}

export default connect(({ productBookmarkDetail, loading }) => ({ productBookmarkDetail, loading }))(Detail)
