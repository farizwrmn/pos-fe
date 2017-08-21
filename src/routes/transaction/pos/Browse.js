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

const Browse = ({ location, pos, loading, onChooseItem, ...modalProps }) => {
  const { list, listMember, listMechanic, listProduct, listService,
    pagination, itemPayment, modalVisible, modalType, isMotion, selectedRowKeys } = pos
  const { pageSize } = pagination
  const width = modalType === "modalPayment" ? '30%' : '80%'
  const modalOpts = {
    ...modalProps,
  }
  // dataSource: (modalType == 'browse' ? list : (modalType == 'browseMechanic' ? listMechanic : (modalType == 'browseService' ? list : list ))),

  const listProps = {
    // dataSource: (modalType == 'browse' ? list : (modalType == 'browseMechanic' ? listMechanic : (modalType == 'browseMechanic' ? listMechanic : (modalType == 'browseService' ? list : list )))),
    dataSource: (
      modalType === 'browseMember' ? listMember :
        modalType === 'browseMechanic' ? listMechanic :
          modalType === 'browseProduct' ? listProduct :
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
    item: itemPayment,
    isMotion,
    onChooseItem (item) {
      onChooseItem(item)
    },
  }

  return (
    <Modal {...modalOpts} width={width} height="80%" footer={[]}>
      { (modalType == 'browse') && <List {...listProps} /> }
      { (modalType == 'browseMember') && <ListMember {...listProps} /> }
      { (modalType == 'browseMechanic') && <ListMechanic {...listProps} /> }
      { (modalType == 'browseProduct') && <ListProduct {...listProps} /> }
      { (modalType == 'browseService') && <ListService {...listProps} /> }
      { (modalType == 'queue') && <ListQueue {...listProps} /> }
      { (modalType == 'modalPayment') && <PaymentList {...listProps}/> }
    </Modal>
  )
}

Browse.propTypes = {
  pos: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object,
}

export default Browse
