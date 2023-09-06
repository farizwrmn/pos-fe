/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col } from 'antd'
import { lstorage } from 'utils'
import moment from 'moment'
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
  importBcaRecon,
  app
}) => {
  const { user } = app
  const { list, listSortPayment, listReconNotMatch, listPaymentMachine, modalVisible, modalStoreVisible,
    currentItem, pagination, paginationListReconLog, listReconLog, storeName, storeId, transDate } = importBcaRecon
  const listImportCSV = {
    dataSource: list,
    pagination,
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/bulkInsert'],
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
    loading: loading.effects['importBcaRecon/query'],
    openModalStore (params) {
      dispatch({ type: 'importBcaRecon/openModalStore', payload: { ...params } })
    },
    onOk: () => {
      const listUserStores = lstorage.getListUserStores()
      const loginTimeDiff = lstorage.getLoginTimeDiff()
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          storeId,
          transDate
        }
      }))

      const localId = lstorage.getStorageKey('udi')
      const serverTime = moment(new Date()).subtract(loginTimeDiff, 'milliseconds').toDate()
      const dataUdi = [
        localId[1],
        localId[2],
        String(storeId),
        localId[4],
        moment(new Date(serverTime)),
        localId[6],
        listUserStores.filter(filtered => filtered.value === storeId)[0].consignmentId ? listUserStores.filter(filtered => filtered.value === storeId)[0].consignmentId.toString() : null
      ]
      lstorage.putStorageKey('udi', dataUdi, localId[0])
      localStorage.setItem('newItem', JSON.stringify({ store: false }))
      // changeRole
      dispatch({ type: 'app/query', payload: { userid: user.userid, role: String(storeId) } })

      localStorage.removeItem('cashier_trans')
      localStorage.removeItem('queue')
      localStorage.removeItem('member')
      localStorage.removeItem('workorder')
      localStorage.removeItem('memberUnit')
      localStorage.removeItem('mechanic')
      localStorage.removeItem('service_detail')
      localStorage.removeItem('consignment')
      localStorage.removeItem('bundle_promo')
      localStorage.removeItem('cashierNo')
      dispatch({ type: 'importBcaRecon/closeModalStore' })
      setTimeout(() => { window.location.reload() }, 1000)
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
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/bulkInsert'],
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
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/bulkInsert'],
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
    query: location.query,
    onClearListImportCSVAndPayment (params) {
      dispatch({ type: 'importBcaRecon/resetListImportCSVAndPayment', payload: { ...params } })
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
    app,
    listSortPayment,
    importBcaRecon
  }) => ({
    loading,
    app,
    listSortPayment,
    importBcaRecon
  })
)(ImportBcaRecon)
