import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button } from 'antd'
import Product from './Product'
import styles from './index.less'
import ModalProduct from './ModalProduct'
import ModalBundle from './ModalBundle'

const Detail = ({
  productBookmarkDetail,
  dispatch,
  loading
}) => {
  const { data, listBookmark, modalProductVisible, modalBundleVisible } = productBookmarkDetail

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
    loading: loading.effects['productBookmark/query'] || loading.effects['productBookmarkDetail/query'],
    location,
    deleteItem (id) {
      dispatch({
        type: 'productBookmark/delete',
        payload: {
          id,
          groupId: data.id
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

  const openBundleModal = () => {
    dispatch({
      type: 'promo/query'
    })
    dispatch({
      type: 'productBookmarkDetail/updateState',
      payload: {
        modalBundleVisible: true
      }
    })
  }

  const refreshList = () => {
    dispatch({
      type: 'productBookmarkDetail/query',
      payload: {
        id: data.id
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
      dispatch({
        type: 'productBookmark/add',
        payload: {
          data: {
            productId: record.id,
            groupId: data.id
          }
        }
      })
      dispatch({
        type: 'productBookmarkDetail/updateState',
        payload: {
          modalProductVisible: false
        }
      })
    }
  }

  const modalBundleProps = {
    isModal: false,
    modalBundleVisible,
    location,
    loading: loading.effects['productstock/query'],
    visible: modalBundleVisible,
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
          modalBundleVisible: false
        }
      })
    },
    async onRowClick (record) {
      dispatch({
        type: 'productBookmark/add',
        payload: {
          data: {
            type: 'BUNDLE',
            productId: record.id,
            groupId: data.id
          }
        }
      })
      dispatch({
        type: 'productBookmarkDetail/updateState',
        payload: {
          modalBundleVisible: false
        }
      })
    }
  }

  return (<div className="content-inner">
    <div className={styles.content}>
      {modalProductVisible && !loading.effects['productBookmark/query'] && <ModalProduct {...modalProductProps} />}
      {modalBundleVisible && !loading.effects['promo/query'] && <ModalBundle {...modalBundleProps} />}
      <Row>
        <Col md={24} lg={12}>
          {content}
        </Col>
        <Col md={24} lg={12}>
          <Button
            type="primary"
            onClick={() => openProductModal()}
            style={{ marginRight: '1em' }}
          >
            Product
          </Button>
          <Button
            type="primary"
            onClick={() => openBundleModal()}
            style={{ marginRight: '1em' }}
          >
            Bundle
          </Button>
          <Button
            icon="reload"
            onClick={() => refreshList()}
          >
            Refresh
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

export default connect(({ productstock, bundling, productBookmark, productBookmarkDetail, loading }) => ({ productstock, bundling, productBookmark, productBookmarkDetail, loading }))(Detail)
