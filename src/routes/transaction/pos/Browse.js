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

const Browse = ({ location, pos, loading, onChooseItem, ...modalProps }) => {
  const { list, listMember, listMechanic, listProduct, listService,
    pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = pos

  const { pageSize } = pagination

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
    isMotion,
    onChooseItem (item) {
      onChooseItem(item)
    },
  }

  return (
    <Modal {...modalOpts} width="80%" height="80%" footer={[]}>
      { (modalType == 'browse') && <List {...listProps} /> }
      { (modalType == 'browseMember') && <ListMember {...listProps} /> }
      { (modalType == 'browseMechanic') && <ListMechanic {...listProps} /> }
      { (modalType == 'browseProduct') && <ListProduct {...listProps} /> }
      { (modalType == 'browseService') && <ListService {...listProps} /> }
      {/*{(modalType == 'browse' ? <List {...listProps} /> : (modalType == 'browseMechanic' ? <ListMechanic {...listProps} /> : (modalType == 'browseService' ? <ListService {...listProps} /> : <ListQueue {...listProps} />)))}*/}
      { (modalType == 'queue') && <ListQueue {...listProps} /> }
    </Modal>
  )
}

Browse.propTypes = {
  pos: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object,
}

export default Browse
