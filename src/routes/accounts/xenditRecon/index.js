import { Checkbox, Col, Row, Tabs } from 'antd'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import React from 'react'
import Transaction from './transaction'
import Balance from './balance'
import ErrorLog from './errorLog'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const {
  getCurrentUserRole
} = lstorage

const transactionColumnProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12
}

class XenditRecon extends React.Component {
  componentDidMount () {
    const { dispatch, location } = this.props
    const { pathname, query } = location
    const { all, ...other } = query
    const userRole = getCurrentUserRole()
    if (userRole !== 'OWN') {
      dispatch(routerRedux.push({
        pathname,
        query: other
      }))
    }
  }

  render () {
    const {
      dispatch,
      location,
      loading,
      xenditRecon
    } = this.props
    const {
      activeKey,

      listBalance,
      paginationBalance,

      listTransaction,
      paginationTransaction,

      listErrorLog,
      paginationErrorLog
    } = xenditRecon
    const userRole = getCurrentUserRole()

    const { all = false } = location.query

    const onChangeAllStore = (event) => {
      const { checked } = event.target
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          all: checked
        }
      }))
    }

    const transactionProps = {
      dataSource: listTransaction,
      pagination: paginationTransaction,
      loading: loading.effects['xenditRecon/queryTransaction'],
      onChangePagination: (pagination) => {
        const { transDate } = location
        const { current: page, pageSize } = pagination
        dispatch({
          type: 'xenditRecon/queryTransaction',
          payload: {
            page,
            pageSize,
            transDate
          }
        })
      },
      onClickTransaction: (id) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname: `${pathname}/detail/${id}`,
          query: {
            ...query,
            type: 'transaction'
          }
        }))
      }
    }

    const balanceProps = {
      dataSource: listBalance,
      pagination: paginationBalance,
      loading: loading.effects['xenditRecon/queryBalance'],
      onChangePagination: (pagination) => {
        const { transDate } = location
        const { current: page, pageSize } = pagination
        dispatch({
          type: 'xenditRecon/queryBalance',
          payload: {
            page,
            pageSize,
            transDate
          }
        })
      },
      onClickBalance: (id) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname: `${pathname}/detail/${id}`,
          query: {
            ...query,
            type: 'balance'
          }
        }))
      }
    }

    const errorLogProps = {
      dataSource: listErrorLog,
      pagination: paginationErrorLog,
      loading: loading.effects['xenditRecon/queryErrorLog'],
      onChangePagination: (pagination) => {
        const { current: page, pageSize } = pagination
        dispatch({
          type: 'xenditRecon/queryErrorLog',
          payload: {
            page,
            pageSize
          }
        })
      }
    }

    const filterProps = {
      location,
      removeTransDate: () => {
        const { pathname, query } = location
        const { from, to, ...other } = query
        dispatch(routerRedux.push({
          pathname,
          query: other
        }))
      },
      onDateChange: (value) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            from: moment(value[0]).format('YYYY-MM-DD'),
            to: moment(value[1]).format('YYYY-MM-DD')
          }
        }))
      }
    }

    return (
      <div className="content-inner">
        <Tabs activeKey={activeKey} type="card" tabBarExtraContent>
          <TabPane key="0" tab="Reconciliation History">
            {userRole === 'OWN' && (
              <Row>
                <Checkbox onChange={onChangeAllStore} checked={JSON.parse(all)}>All Store</Checkbox>
              </Row>
            )}
            <Row justify="end" type="flex">
              <Filter {...filterProps} />
            </Row>
            <Row>
              <Col {...transactionColumnProps}>
                <Transaction {...transactionProps} />
              </Col>
              <Col {...transactionColumnProps}>
                <Balance {...balanceProps} />
              </Col>
            </Row>
            {userRole === 'OWN' && (
              <Row>
                <ErrorLog {...errorLogProps} />
              </Row>
            )}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default connect(({
  xenditRecon,
  loading
}) => ({ xenditRecon, loading }))(XenditRecon)
