import { Button, Col, Modal, Row } from 'antd'
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
  const { list, listUnrelated, unrelatedPagination, unrelatedSearchKey, pagination, modalVisible } = paymentMachineStore

  const listProps = {
    dataSource: list,
    pagination,
    loading,
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
    handleDelete: (record) => {
      Modal.confirm({
        title: 'Delete this machine',
        content: 'Are you sure?',
        onOk: () => {
          dispatch({
            type: 'paymentMachineStore/queryDelete',
            payload: {
              location,
              id: record.id
            }
          })
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
    loading,
    title: 'Add new machine to this store',
    unrelatedSearchKey,
    listUnrelated,
    pagination: unrelatedPagination,
    visible: modalVisible,
    handleSubmit: (machineId) => {
      const params = {
        storeId: lstorage.getCurrentUserStore(),
        machineId,
        page: unrelatedPagination.current || 1,
        pageSize: unrelatedPagination.pageSize || 10,
        q: unrelatedSearchKey || ''
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
          <Button type="primary" size="small" icon="plus" onClick={handleShowModal}>Add New</Button>
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
