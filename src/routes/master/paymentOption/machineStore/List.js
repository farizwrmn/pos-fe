import { Row, Table } from 'antd'
import { color } from 'utils/theme'
import ModalForm from './ModalForm'

const List = ({ ...tableProps, currentMachine, currentMachineStore, handlePagination, listAllStores, dispatch, modalVisible, loading, location }) => {
  const columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      width: 100
    },
    {
      title: 'Payment Option',
      key: 'paymentOption',
      dataIndex: 'paymentOption',
      width: 40,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Account',
      key: 'accountCode.accountName',
      dataIndex: 'accountCode.accountName',
      width: 100
    }
  ]

  const handleShowModal = (record) => {
    dispatch({
      type: 'paymentMachineStore/updateState',
      payload: {
        modalVisible: true,
        currentMachine: record,
        currentMachineStore: (record.machineStoreList || []).map(record => String(record.storeId))
      }
    })
  }

  const modalProps = {
    currentMachine,
    currentMachineStore,
    listAllStores,
    visible: modalVisible,
    confirmLoading: loading.effects['paymentMachineStore/queryAdd'],
    title: 'Store associated with account',
    onCancel: () => {
      dispatch({
        type: 'paymentMachineStore/updateState',
        payload: {
          modalVisible: false,
          currentMachine: {},
          currentMachineStore: []
        }
      })
    },
    onOk: () => {
      dispatch({
        type: 'paymentMachineStore/queryAdd',
        payload: {
          machine: currentMachine,
          storeList: currentMachineStore,
          location
        }
      })
    },
    handleRowCheck: (checkedList) => {
      const { checked: checkedNode } = checkedList
      dispatch({
        type: 'paymentMachineStore/updateState',
        payload: {
          currentMachineStore: checkedNode
        }
      })
    }
  }

  return (
    <div>
      {modalVisible && (
        <ModalForm {...modalProps} />
      )}
      <Row>
        <div style={{ color: color.error }}>
          * Klik data di bawah ini untuk melihat store yang terhubung dengan jenis payment
        </div>
      </Row>
      <Row>
        <Table
          {...tableProps}
          bordered
          columns={columns}
          onChange={handlePagination}
          onRowClick={handleShowModal}
          loading={loading.effects['paymentMachineStore/query']}
        />
      </Row>
    </div>
  )
}

export default List
