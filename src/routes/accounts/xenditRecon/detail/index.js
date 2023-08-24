import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Col, Row, message } from 'antd'
import ListBalance from './ListBalance'
import ListTransaction from './ListTransaction'
import Filter from './Filter'

class Detail extends React.Component {
  render () {
    const {
      dispatch,
      location,
      loading,
      xenditRecon
    } = this.props
    const {
      listTransactionDetail,
      paginationTransactionDetail,
      listBalanceDetail,
      paginationBalanceDetail
    } = xenditRecon

    const handleBackButton = () => {
      const query = {}
      if (location.query.transDate) query.transDate = location.query.transDate
      if (location.query.all) query.all = location.query.all
      dispatch(routerRedux.push({
        pathname: '/accounting/xendit-recon',
        query
      }))
    }

    const { type } = location.query
    if (!type || (type !== 'transaction' && type !== 'balance')) {
      message.error('Invalid Type')
      handleBackButton()
      return
    }

    const listBalanceProps = {
      loading: loading.effects['xenditRecon/queryBalanceDetail'],
      dataSource: listBalanceDetail,
      pagination: paginationBalanceDetail,
      onChangePagination: (pagination) => {
        const { current: page, pageSize } = pagination
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

    const listTransactionProps = {
      loading: loading.effects['xenditRecon/queryTransactionDetail'],
      dataSource: listTransactionDetail,
      pagination: paginationTransactionDetail,
      onChangePagination: (pagination) => {
        const { current: page, pageSize } = pagination
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
      onSearch: (value) => {
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

    return (
      <div className="content-inner">
        <Row>
          <Col span={24}>
            <Row style={{ marginBottom: '10px' }}>
              <Button icon="rollback" type="primary" onClick={handleBackButton}>Back</Button>
            </Row>
            <Row justify="end" type="flex">
              <Filter {...filterProps} />
            </Row>
            <Row>
              {type === 'balance' && <ListBalance {...listBalanceProps} />}
              {type === 'transaction' && <ListTransaction {...listTransactionProps} />}
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(({
  xenditRecon,
  loading
}) => ({ xenditRecon, loading }))(Detail)
