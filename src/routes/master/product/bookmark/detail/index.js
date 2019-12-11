import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button } from 'antd'
import Product from './Product'
import styles from './index.less'

const Detail = ({
  productBookmarkDetail,
  dispatch,
  loading
}) => {
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

  const productProps = {
    dataSource: data && data.bookmark ? data.bookmark : [],
    loading: loading.effects['productBookmark/query'],
    location,
    deleteItem (id) {
      dispatch({
        type: 'productBookmark/delete',
        payload: id
      })
    }
  }

  const openProductModal = () => {
    dispatch({
      type: 'productstock/query'
    })
  }


  return (<div className="content-inner">
    <div className={styles.content}>
      <Row>
        <Col md={24} lg={12}>
          {content}
        </Col>
        <Col md={24} lg={12}>
          <Button
            onClick={() => openProductModal()}
          >
            Product
          </Button>
          <Product {...productProps} />
        </Col>
      </Row>
    </div>
  </div>)
}

Detail.propTypes = {
  productBookmarkDetail: PropTypes.object
}

export default connect(({ productstock, productBookmark, productBookmarkDetail, loading }) => ({ productstock, productBookmark, productBookmarkDetail, loading }))(Detail)
