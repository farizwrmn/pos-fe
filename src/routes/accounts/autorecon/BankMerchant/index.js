import { Button, Col, Row, Table } from 'antd'
import { routerRedux } from 'dva/router'
import ModalForm from './ModalForm'
import Filter from './Filter'

const columnProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 16,
  xl: 12
}

const filterColumnProps = {
  xs: 24,
  sm: 24,
  md: 8,
  lg: 6,
  xl: 6
}

const BankMerchant = ({ dispatch, loading, autorecon, store, bank, location }) => {
  const { listBankMerchant, currentBankMerchant, pagination, BankMerchantModalVisible } = autorecon
  const { listStore } = store
  const { listBank } = bank

  const editBankMerchant = (id) => {
    const currentItem = listBankMerchant.filter(filtered => filtered.id === id)
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        currentBankMerchant: currentItem[0] || {},
        BankMerchantModalVisible: true
      }
    })
  }

  const column = [
    {
      title: 'Merchant Id',
      key: 'merchantId',
      dataIndex: 'merchantId',
      width: 100
    },
    {
      title: 'Merchant Name',
      key: 'merchantName',
      dataIndex: 'merchantName',
      width: 200
    },
    {
      title: 'Assigned Store',
      key: 'store.storeName',
      dataIndex: 'store.storeName',
      width: 150
    },
    {
      title: 'Bank',
      key: 'bank.bankName',
      dataIndex: 'bank.bankName',
      width: 50
    },
    {
      title: 'Action',
      width: 50,
      render: (_, record) => <div style={{ textAlign: 'center' }}><Button type="primary" size="small" onClick={() => editBankMerchant(record.id)}>Edit</Button></div>
    }
  ]

  const showModalForm = () => {
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        BankMerchantModalVisible: true
      }
    })
  }

  const handleTableChange = (paginationParams) => {
    const { current, pageSize } = paginationParams
    const { pathname, query } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        page: current,
        pageSize
      }
    }))
  }

  const modalFormProps = {
    currentBankMerchant,
    listBank,
    listStore,
    loading,
    visible: BankMerchantModalVisible,
    onClose () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          BankMerchantModalVisible: false,
          currentBankMerchant: {}
        }
      })
    },
    addMerchant (params) {
      dispatch({
        type: 'autorecon/addMerchant',
        payload: {
          ...params,
          location
        }
      })
    },
    editMerchant (params) {
      dispatch({
        type: 'autorecon/editMerchant',
        payload: {
          ...params,
          location
        }
      })
    }
  }

  const filterProps = {
    handleSearch (value) {
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: 1,
          q: value
        }
      }))
    }
  }

  return (
    <div>
      <ModalForm {...modalFormProps} />
      <Row style={{ marginBottom: '10px' }} type="flex">
        <Button icon="plus-circle-o" type="primary" onClick={() => showModalForm()}>New</Button>
      </Row>
      <Row style={{ marginBottom: '10px' }}>
        <Col {...filterColumnProps} style={{ alignSelf: 'flex-end' }}>
          <Filter {...filterProps} />
        </Col>
      </Row>
      <Row>
        <Col {...columnProps}>
          <Table
            loading={loading.effects['autorecon/queryBankMerchant']}
            dataSource={listBankMerchant}
            pagination={pagination}
            columns={column}
            bordered
            scroll={{ x: 400 }}
            onChange={handleTableChange}
          />
        </Col>
      </Row>
    </div>
  )
}

export default BankMerchant
