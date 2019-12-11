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
  const { data, listBookmark, modalProductVisible } = productBookmarkDetail

  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      if (key !== 'bookmark') {
        content.push(<div key={key} className={styles.item}>
          <div>{key}</div>
          <div>{String(data[key])}</div>
        </div>)
      }
    }
  }

  const productProps = {
    dataSource: listBookmark,
    loading: loading.effects['productBookmark/query'],
    location,
    async deleteItem (id) {
      await dispatch({
        type: 'productBookmark/delete',
        payload: id
      })
      await dispatch({
        type: 'productBookmarkDetail/query',
        payload: {
          id: data.id
        }
      })
    }
  }

  const openProductModal = () => {
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
    async onRowClick (record) {
      await dispatch({
        type: 'productBookmark/add',
        payload: {
          data: {
            productId: record.id,
            groupId: data.id
          }
        }
      })
      await dispatch({
        type: 'productBookmarkDetail/query',
        payload: {
          id: data.id
        }
      })
      await dispatch({
        type: 'productBookmarkDetail/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    }
  }

  return (<div className="content-inner">
    <div className={styles.content}>
      {modalProductVisible && !loading.effects['productBookmark/query'] && <ModalProduct {...modalProductProps} />}
      <Row>
        <Col md={24} lg={12}>
          {content}
        </Col>
        <Col md={24} lg={12}>
          <Button
            type="primary"
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
