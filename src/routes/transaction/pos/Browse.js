import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import List from './List'
import ListMember from './ListMember'
import ListMechanic from './ListMechanic'
import ListProductLock from './ListProductLock'
import ListService from './ListService'
import ListWorkOrder from './ListWorkOrder'
import ListQueue from './ListQueue'
// import PaymentList from './PaymentList'
// import ServiceList from './ServiceList'
import ListAsset from './ListAsset'

const Browse = ({ location, showProductQty, onChange, dispatch, pos, loading, DeleteItem, onChooseItem, totalItem, onChangeTotalItem, ...modalProps }) => {
  const { listMember, listAsset, pagination, listMechanic, listProduct, listService, itemPayment, itemService, modalType, isMotion, listWOHeader } = pos

  const width = (modalType === 'modalPayment' || modalType === 'modalService') ? '45%' : '80%'
  const modalOpts = {
    ...modalProps
  }
  let listProductLock = listProduct
  let listProductFree = listProduct
  const listProps = {
    dataSource: (
      modalType === 'browseMember' ? listMember :
        modalType === 'browseAsset' ? listAsset :
          modalType === 'browseMechanic' ? listMechanic :
            modalType === 'browseWorkOrder' ? listWOHeader :
              modalType === 'browseProductLock' ? listProductLock :
                modalType === 'browseProductFree' ? listProductFree :
                  modalType === 'browseService' ? listService : listMember
    ),
    // loading: loading.effects[(modalType==='browse' ? 'pos/query' : (modalType==='browseMechanic' ? 'pos/queryMechanic' : (modalType==='browseService' ? 'pos/queryService' : '')))],
    loading: modalType === 'browseProductLock' || modalType === 'browseProductFree' ? loading : loading.effects[(
      modalType === 'browseMember' ? 'pos/getMembers' :
        modalType === 'browseWorkOrder' ? 'pos/queryWOHeader' :
          modalType === 'browseMechanic' ? 'pos/getMechanics' :
            modalType === 'browseService' ? 'pos/getServices' : 'pos/queryMember'
    )],
    pagination,
    location,
    item: modalType === 'modalPayment' ? itemPayment : {},
    itemService: modalType === 'modalService' ? itemService : {},
    isMotion,
    totalItem,
    onChange (e) {
      onChange(e)
    },
    onChooseItem (item) {
      onChooseItem(item)
    },
    showProductQty (id) {
      showProductQty(id)
    },
    DeleteItem (item) {
      DeleteItem(item)
    },
    onChangeTotalItem (e) {
      onChangeTotalItem(e)
    }
  }

  return (
    <Modal className="modal-browse" width={width} {...modalOpts} footer={null}>
      {(modalType === 'browse') && <List {...listProps} />}
      {(modalType === 'browseAsset') && <ListAsset {...listProps} />}
      {(modalType === 'browseMember') && <ListMember {...listProps} />}
      {(modalType === 'browseMechanic') && <ListMechanic {...listProps} />}
      {(modalType === 'browseProductLock') && <ListProductLock {...listProps} />}
      {(modalType === 'browseProductFree') && <ListProductLock {...listProps} />}
      {(modalType === 'browseService') && <ListService {...listProps} />}
      {(modalType === 'browseWorkOrder') && <ListWorkOrder {...listProps} />}
      {(modalType === 'queue') && <ListQueue {...listProps} />}
      {/* {(modalType === 'modalPayment') && <PaymentList {...listProps} />}
      {(modalType === 'modalService') && <ServiceList {...listProps} />} */}
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
