import { Button, Col, Modal, Row, message } from 'antd'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import List from './List'
import Filter from './Filter'
import ModalForm from './Modal'

const filterColumnProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 8
}

const MachineStore = ({
  paymentMachineStore,
  loading,
  dispatch,
  location
}) => {
  const {
    list,
    listUnrelated,
    unrelatedPagination,
    unrelatedSearchKey,
    pagination,
    modalVisible,
    selectedRemoveList,
    selectedAddList
  } = paymentMachineStore

  const handleDeleteMachine = () => {
    Modal.confirm({
      title: 'Delete machine from this store',
      content: 'Are you sure?',
      onOk: () => {
        dispatch({
          type: 'paymentMachineStore/queryDelete',
          payload: {
            id: selectedRemoveList,
            location
          }
        })
      }
    })
  }

  // list props
  const listProps = {
    dataSource: list,
    pagination,
    loading,
    selectedRemoveList,
    handlePagination (paginationValue) {
      const { current: page, pageSize } = paginationValue
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page,
          pageSize
        }
      }))
    },
    handleDelete: (value, record) => {
      const { checked } = value.target
      dispatch({
        type: 'paymentMachineStore/updateState',
        payload: {
          selectedRemoveList: checked ? selectedRemoveList.concat(record.id) : selectedRemoveList.filter(filtered => filtered !== record.id)
        }
      })
    }
  }

  const filterProps = {
    location,
    onSubmit (value) {
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          q: value,
          page: 1
        }
      }))
    }
  }

  const handleShowModal = () => {
    if (!modalVisible && listUnrelated.length === 0) {
      const { current: page = 1, pageSize = 5 } = unrelatedPagination
      dispatch({
        type: 'paymentMachineStore/queryUnrelated',
        payload: {
          page,
          pageSize,
          q: unrelatedSearchKey
        }
      })
    }
    dispatch({
      type: 'paymentMachineStore/updateState',
      payload: {
        modalVisible: !modalVisible
      }
    })
  }

  const modalFormProps = {
    selectedAddList,
    loading,
    title: 'Add new machine to this store',
    unrelatedSearchKey,
    listUnrelated,
    pagination: unrelatedPagination,
    visible: modalVisible,
    handleSubmit: () => {
      if (selectedAddList.length === 0) {
        message.error('No machine selected to be added!')
        return
      }
      const params = {
        storeId: lstorage.getCurrentUserStore(),
        machineId: selectedAddList,
        page: unrelatedPagination.current || 1,
        pageSize: unrelatedPagination.pageSize || 10,
        q: unrelatedSearchKey || '',
        location
      }
      dispatch({
        type: 'paymentMachineStore/queryAdd',
        payload: params
      })
    },
    handleCancel: handleShowModal,
    handleUnrelatedPagination: (pageOpt) => {
      const { current: page, pageSize = 5 } = pageOpt
      dispatch({
        type: 'paymentMachineStore/queryUnrelated',
        payload: {
          page,
          pageSize,
          q: unrelatedSearchKey
        }
      })
    },
    handleSearch: (value) => {
      const { pageSize = 5 } = unrelatedPagination
      dispatch({
        type: 'paymentMachineStore/queryUnrelated',
        payload: {
          page: 1,
          pageSize,
          q: value
        }
      })
    },
    handleAdd: (value, record) => {
      const { checked } = value.target
      dispatch({
        type: 'paymentMachineStore/updateState',
        payload: {
          selectedAddList: checked ? selectedAddList.concat(record.id) : selectedAddList.filter(filtered => filtered !== record.id)
        }
      })
    }
  }

  return (
    <div>
      <Row type="flex" justify="end">
        <Col {...filterColumnProps}>
          <Filter {...filterProps} />
        </Col>
      </Row>
      <Row style={{ marginBottom: '10px' }}>
        <Col {...filterColumnProps}>
          <Row gutter={10} type="flex" justify="start">
            <Col>
              <Button type="primary" size="small" icon="plus" onClick={handleShowModal}>Add New</Button>
            </Col>
            <Col>
              <Button type="danger" size="small" icon="minus" onClick={handleDeleteMachine} disabled={selectedRemoveList.length === 0}>Remove Machine</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <List {...listProps} />
        </Col>
      </Row>
      {modalVisible && (
        <ModalForm {...modalFormProps} />
      )}
    </div>
  )
}

export default MachineStore
