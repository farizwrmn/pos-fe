import React from 'react'
import PropTypes from 'prop-types'
import {Table, Modal, Button} from 'antd'
import ListProduct from './ListProduct'
import PurchaseList from './PurchaseList'

const Browse = ({location, purchase, loading, onChooseItemItem, ...purchaseProps}) => {
  const {listProduct, pagination, itemPayment, modalType, isMotion} = purchase
  const {pageSize} = pagination
  const modalOpts = {
    ...purchaseProps,
  }
  let listProductFilter = listProduct.filter(el => el.active === true)
  const listProps = {
    dataSource: (listProductFilter),
    loading: loading.effects[(
      'purchase/getProducts'
    )],
    pagination,
    location,
    item: itemPayment,
    isMotion,
    onChooseItem (item) {
      onChooseItemItem(item)
    },
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
  loading: PropTypes.object,
}

export default Browse
