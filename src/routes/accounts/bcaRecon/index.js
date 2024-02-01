/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Modal, Row, Col } from 'antd'
import { lstorage } from 'utils'
import ListImportCSV from './ListImportCSV'
import ListPayment from './ListPayment'
import ListSettlementAccumulated from './ListSettlementAccumulated'
import Form from './Form'
// import ListErrorLog from './ListErrorLog'
import ListReconLog from './ListReconLog'
import FormInputMdrAmount from './FormInputMdrAmount'
import styles from '../../../themes/index.less'

const ImportBcaRecon = ({
  loading,
  dispatch,
  location,
  importBcaRecon
}) => {
  const { list, listSortPayment, listReconNotMatch, listPaymentMachine, modalVisible, modalStoreVisible,
    currentItem, pagination, paginationListReconLog, listReconLog, storeName } = importBcaRecon
  const listImportCSV = {
    dataSource: list,
    pagination,
    loading: loading.effects['importBcaRecon/sortNullMdrAmount'] || loading.effects['importBcaRecon/bulkInsert'],
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    }
  }

  const listReconLogProps = {
    dataSource: listReconLog,
    pagination: paginationListReconLog,
    storeName,
    modalStoreVisible,
    loading: loading.effects['importBcaRecon/queryReconLog'] || loading.effects['importBcaRecon/sortNullMdrAmount'],
    openModalStore (params) {
      const listUserStores = lstorage.getListUserStores()
      const filterStore = listUserStores.filter(filtered => filtered.value === params.storeId)
      if (filterStore && filterStore.length > 0) {
        const store = filterStore[0]
        dispatch({
          type: 'importBcaRecon/updateState',
          payload: {
            storeName: store.label,
            storeId: store.value,
            transDate: params.transDate,
            reconLogId: params.id
          }
        })
        Modal.confirm({
          title: 'Pindah Store',
          content: `Pindah ke Store: ${store.label}`,
          onOk () {
            dispatch({ type: 'importBcaRecon/processChangeStore', payload: { location } })
          }
        })
      }
    },
    onOk: () => {
      dispatch({ type: 'importBcaRecon/processChangeStore', payload: { location } })
    },
    onCancel () {
      dispatch({ type: 'importBcaRecon/closeModalStore' })
    },
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    }
  }

  const listSettlementAccumulatedProps = {
    dataSource: listPaymentMachine,
    pagination,
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/sortNullMdrAmount'] || loading.effects['importBcaRecon/bulkInsert'],
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    }
  }

  const formModalInputMdrAmountProps = {
    loading,
    modalVisible,
    currentItem,
    listSortPayment,
    listReconNotMatch,
    query: location.query,
    onCancel () {
      dispatch({ type: 'importBcaRecon/closeModal' })
    },
    onSubmit (params) {
      dispatch({
        type: 'importBcaRecon/updateList',
        payload: {
          ...params
        }
      })
    }
  }

  const listPaymentProps = {
    dataSource: listSortPayment,
    pagination,
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/sortNullMdrAmount'] || loading.effects['importBcaRecon/bulkInsert'],
    openModalInputMdrAmount (params) {
      dispatch({ type: 'importBcaRecon/openModalInputMdrAmount', payload: { ...params } })
    },
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    }
  }

  const formProps = {
    loading,
    dispatch,
    location,
    query: location.query,
    onClearListImportCSVAndPayment (params) {
      dispatch({ type: 'importBcaRecon/resetListImportCSVAndPayment', payload: { ...params, location } })
    },
    onSortNullMdrAmount (params) {
      dispatch({
        type: 'importBcaRecon/sortNullMdrAmount',
        payload: {
          ...params
        }
      })
    },
    onQueryPosPayment (params) {
      dispatch({
        type: 'importBcaRecon/queryPosPayment',
        payload: {
          ...params
        }
      })
    },
    onSubmit (params) {
      dispatch({
        type: 'importBcaRecon/query',
        payload: {
          location,
          ...params
        }
      })
    }
  }


  return (
    <div className="content-inner">
      <h1>Bank Recon</h1>
      <div>
        {modalVisible && <FormInputMdrAmount {...formModalInputMdrAmountProps} />}
      </div>
      <Row>
        <Col>
          <Form {...formProps} />
        </Col>
      </Row>
      <Row>
        <Col style={{ padding: '1em' }}>
          <h3>Total Transfer</h3>
          <ListSettlementAccumulated {...listSettlementAccumulatedProps} />
        </Col>
      </Row>
      <Row type="flex" justify="space-between">
        <Col span={12} className={styles.alignCenter}><h3>Transaksi POS</h3></Col>
        <Col span={12} className={styles.alignCenter}><h3>Data Dari Bank</h3></Col>
      </Row>
      <Row>
        <Col span={12} style={{ padding: '1em' }}>
          <ListPayment {...listPaymentProps} />
        </Col>
        <Col span={12} style={{ padding: '1em' }}>
          <ListImportCSV {...listImportCSV} />
        </Col>
      </Row>
      <Row>
        <Col>
          <ListReconLog {...listReconLogProps} />
        </Col>
      </Row>

    </div>
  )
}

export default connect(
  ({
    loading,
    importBcaRecon
  }) => ({
    loading,
    importBcaRecon
  })
)(ImportBcaRecon)
