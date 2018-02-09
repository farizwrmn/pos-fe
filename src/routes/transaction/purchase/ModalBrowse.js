import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProduct'

const Browse = ({ location, purchase, loading, onChooseItemItem, ...purchaseProps }) => {
  const { listProduct, itemPayment, modalType, isMotion } = purchase
  const modalOpts = {
    ...purchaseProps
  }
  let listProductFilter = listProduct.filter(el => el.active === true)
  const listProps = {
    dataSource: listProductFilter,
    loading: loading.effects[(
      'purchase/getProducts'
    )],
    location,
    item: itemPayment,
    isMotion,
    onChooseItem (item) {
      onChooseItemItem(item)
    }
  }

  return (
    <Modal {...modalOpts} width={'80%'} height="80%" footer={[]}>
      { (modalType === 'browseProduct') && <ListProduct {...listProps} /> }
    </Modal>
  )
}

Browse.propTypes = {
  purchase: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object
}

export default Browse
