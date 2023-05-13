import { Button, Col, Row } from 'antd'
import { routerRedux } from 'dva/router'
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
  const { list, listUnrelated, unrelatedPagination, pagination, modalVisible } = paymentMachineStore

  const listProps = {
    dispatch,
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
      dispatch({
        type: 'paymentMachineStore/queryUnrelated',
        payload: {
          page: 1,
          pageSize: 10
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
    title: 'Add new machine to this store?',
    listUnrelated,
    pagination: unrelatedPagination,
    visible: modalVisible,
    handleSubmit: () => {

    },
    handleCancel: handleShowModal,
    handleUnrelatedPagination: (pageOpt) => {
      const { current: page, pageSize } = pageOpt
      dispatch({
        type: 'paymentMachineStore/queryUnrelated',
        payload: {
          page,
          pageSize
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
