import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button } from 'antd'
import Product from './Product'
import styles from './index.less'
import ModalProduct from './ModalProduct'

const Detail = ({
  productBookmarkDetail,
  dispatch,
  loading
}) => {
  const { data, modalProductVisible } = productBookmarkDetail

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
    console.log('click')

    dispatch({
      type: 'productstock/query'
    })
    dispatch({
      type: 'productBookmarkDetail/updateState',
      payload: {
        modalProductVisible: true
      }
    })
  }

  const modalProductProps = {
    isModal: false,
    modalProductVisible,
    location,
    loading: loading.effects['productstock/query'],
    visible: modalProductVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          list: []
        }
      })
      dispatch({
        type: 'productBookmarkDetail/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    },
    onRowClick () {
      console.log('click row')
    }
  }

  return (<div className="content-inner">
    <div className={styles.content}>
      {modalProductVisible && <ModalProduct {...modalProductProps} />}
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
