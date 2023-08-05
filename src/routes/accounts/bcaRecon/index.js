/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col } from 'antd'
import ListImportCSV from './ListImportCSV'
import ListPayment from './ListPayment'
import Form from './Form'
import styles from '../../../themes/index.less'

const ImportBcaRecon = ({
  loading,
  dispatch,
  importBcaRecon
}) => {
  const { list, listRecon, currentMerchant, pagination } = importBcaRecon
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

  const listPaymentProps = {
    dataSource: listRecon,
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

  const formProps = {
    loading,
    currentMerchant,
    query: location.query,
    showImportModal () {
      dispatch({
        type: 'importBcaRecon/updateState',
        payload: {
          modalVisible: true
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
      <Row>
        <Col>
          <Form {...formProps} />
        </Col>
      </Row>
      <Row type="flex" justify="space-between">
        <Col span={12} className={styles.alignCenter}><h3>Transaksi POS K3MART</h3></Col>
        <Col span={12} className={styles.alignCenter}><h3>Rekening Koran Bank</h3></Col>
      </Row>
      <Row>
        <Col span={12} style={{ padding: '1em' }}>
          <ListPayment {...listPaymentProps} />
        </Col>
        <Col span={12} style={{ padding: '1em' }}>
          <ListImportCSV {...listImportCSV} />
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
