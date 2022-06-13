import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProduct'

const ModalProduct = ({
  listProductProps,
  ...modalListProductProps
}) => {
  return (
    <Modal {...modalListProductProps} width="80%" height="80%" footer={null}>
      <ListProduct {...listProductProps} />
    </Modal>
  )
}

ModalProduct.propTypes = {
  purchase: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object
}

export default ModalProduct
