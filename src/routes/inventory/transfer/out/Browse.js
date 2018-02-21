import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProductLock'

const Browse = ({ location, pos, loading, DeleteItem, onChooseItem, totalItem, onChangeTotalItem, ...modalProps }) => {
  const { listProduct, itemPayment, itemService, modalType, isMotion } = pos
  const width = '80%'
  const modalOpts = {
    ...modalProps
  }
  let listProductLock = listProduct.filter(el => el.count > 0)
  const listProps = {
    dataSource: listProductLock,
    // loading: loading.effects[(modalType==='browse' ? 'pos/query' : (modalType==='browseMechanic' ? 'pos/queryMechanic' : (modalType==='browseService' ? 'pos/queryService' : '')))],
    loading: loading.effects[(
      modalType === 'browseMember' ? 'pos/getMembers' :
        modalType === 'browseMechanic' ? 'pos/getMechanics' :
          modalType === 'browseProductLock' || modalType === 'browseProductFree' ? 'pos/getProducts' :
            modalType === 'browseService' ? 'pos/queryService' : 'pos/queryMember'
    )],
    // pagination,
    location,
    item: modalType === 'modalPayment' ? itemPayment : {},
    itemService: modalType === 'modalService' ? itemService : {},
    isMotion,
    totalItem,
    onChooseItem (item) {
      onChooseItem(item)
    }
  }
  return (
    <Modal {...modalOpts} width={width} height="80%" footer={[]}>
      <ListProduct {...listProps} />
    </Modal>
  )
}

Browse.propTypes = {
  pos: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object,
  onChangeTotalItem: PropTypes.func.isRequired,
  DeleteItem: PropTypes.func.isRequired,
  onChooseItem: PropTypes.func.isRequired,
  totalItem: PropTypes.string
}

export default Browse
