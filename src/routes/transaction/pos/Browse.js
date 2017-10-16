import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Button } from 'antd'
import List from './List'
import ListMember from './ListMember'
import ListMechanic from './ListMechanic'
import ListProduct from './ListProduct'
import ListService from './ListService'
import ListQueue from './ListQueue'
import PaymentList from './PaymentList'
import ServiceList from './ServiceList'

const Browse = ({ location, pos, loading, DeleteItem, onChooseItem, totalItem, onChangeTotalItem, ...modalProps }) => {
  const { listMember, listMechanic, listProduct, listService,
    pagination, itemPayment, itemService, modalType, isMotion } = pos
  const { pageSize } = pagination
  const width = modalType === 'modalPayment' || modalType === 'modalService' ? '45%' : '80%'
  const modalOpts = {
    ...modalProps,
  }
  let listProductFilter = listProduct.filter(el => el.active === true)
  // dataSource: (modalType == 'browse' ? list : (modalType == 'browseMechanic' ? listMechanic : (modalType == 'browseService' ? list : list ))),
  const listProps = {
    // dataSource: (modalType == 'browse' ? list : (modalType == 'browseMechanic' ? listMechanic : (modalType == 'browseMechanic' ? listMechanic : (modalType == 'browseService' ? list : list )))),
    dataSource: (
      modalType === 'browseMember' ? listMember :
        modalType === 'browseMechanic' ? listMechanic :
          modalType === 'browseProduct' ? listProductFilter :
            modalType === 'browseService' ? listService : listMember
    ),
    // loading: loading.effects[(modalType == 'browse' ? 'pos/query' : (modalType == 'browseMechanic' ? 'pos/queryMechanic' : (modalType == 'browseService' ? 'pos/queryService' : '')))],
    loading: loading.effects[(
      modalType === 'browseMember' ? 'pos/getMembers' :
        modalType === 'browseMechanic' ? 'pos/getMechanics' :
          modalType === 'browseProduct' ? 'pos/getProducts' :
            modalType === 'browseService' ? 'pos/queryService' : 'pos/queryMember'
    )],
    pagination,
    location,
    item: modalType === 'modalPayment' ? itemPayment : {},
    itemService: modalType === 'modalService' ? itemService : {},
    isMotion,
    totalItem,
    onChooseItem (item) {
      onChooseItem(item)
    },
    DeleteItem (item) {
      DeleteItem(item)
    },
    onChangeTotalItem (e) {
      onChangeTotalItem(e)
    },
  }

  return (
    <Modal {...modalOpts} width={width} height="80%" footer={[]}>
      { (modalType === 'browse') && <List {...listProps} /> }
      { (modalType === 'browseMember') && <ListMember {...listProps} /> }
      { (modalType === 'browseMechanic') && <ListMechanic {...listProps} /> }
      { (modalType === 'browseProduct') && <ListProduct {...listProps} /> }
      { (modalType === 'browseService') && <ListService {...listProps} /> }
      { (modalType === 'queue') && <ListQueue {...listProps} /> }
      { (modalType === 'modalPayment') && <PaymentList {...listProps} /> }
      { (modalType === 'modalService') && <ServiceList {...listProps} /> }
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
  totalItem: PropTypes.string.isRequired,
}

export default Browse
