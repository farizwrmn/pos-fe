/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {
  numberFormat
} from 'utils'
import Browse from './Browse'
import BrowseTotal from './BrowseTotal'
import BrowseReturn from './BrowseReturn'
import Filter from './Filter'

const Report = ({ dispatch, paymentOpts, dashboard, posPaymentReport, returnSalesDetail, loading, app }) => {
  const { list } = returnSalesDetail
  const { listTrans, listBalance, from, to, productCode } = posPaymentReport
  const { listSalesCategory, listStockByCategory } = dashboard
  const { listOpts } = paymentOpts
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['posPaymentReport/query'],
    dataSource: listTrans,
    listTrans,
    storeInfo,
    pagination: false,
    user,
    from,
    to,
    productCode
  }

  const browseReturnTotalProps = {
    loading: loading.effects['returnSalesDetail/query'],
    list,
    dataSource: list,
    pagination: false
  }

  const browseTotalProps = {
    listOpts,
    dataSource: [],
    pagination: false
  }

  const filterProps = {
    listSalesCategory,
    listStockByCategory,
    listTrans,
    listBalance,
    user,
    loading,
    storeInfo,
    from,
    to,
    productCode,
    onListReset () {
      dispatch({
        type: 'posPaymentReport/setListNull'
      })
    },
    onDateChange (from, to, balanceId) {
      // dispatch({
      //   type: 'posPaymentReport/query',
      //   payload: {
      //     from,
      //     to
      //   }
      // })
      // dispatch({
      //   type: 'posPaymentReport/setDate',
      //   payload: {
      //     from,
      //     to
      //   }
      // })
      const { pathname, query } = location
      if (balanceId && from && to) {
        dispatch({
          type: 'posPaymentReport/query',
          payload: {
            balanceId,
            from,
            to
          }
        })
        dispatch({
          type: 'dashboard/querySalesCategory',
          payload: {
            balanceId,
            from,
            to
          }
        })
      } else {
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            from,
            to
          }
        }))
      }
    }
  }
  let groupBy = (xs) => {
    return xs
      .reduce((prev, next) => {
        if (next.machine) {
          (prev[next.machine] = prev[next.machine] || []).push(next)
          return prev
        }
        (prev.cash = prev.cash || []).push(next)
        return prev
      }, {})
  }

  let groupByKey = (xs, key) => {
    return xs
      .reduce((prev, next) => {
        (prev[next[key]] = prev[next[key]] || []).push(next)
        return prev
      }, {})
  }
  let groubedByTeam = groupBy(listTrans)
  let groupByEdc = groupByKey(listTrans, 'typeCode')
  let arr
  let arrByEdc = []
  try {
    arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])
    arrByEdc = Object.keys(groubedByTeam)
      .map((index) => {
        const mapTypeCode = listOpts.map(item => ({
          key: item.typeCode,
          value: groupByEdc[item.typeCode]
        }))

        const bankInfo = index && groubedByTeam && groubedByTeam[index] && groubedByTeam[index][0] ? groubedByTeam[index][0] : {}
        const mapObj = {
          machine: bankInfo && bankInfo.paymentMachine && bankInfo.paymentMachine.name ? bankInfo.paymentMachine.name : 'CASH'
        }
        for (let key in mapTypeCode) {
          const item = mapTypeCode[key]
          mapObj[item.key] = item.value ?
            item.value
              .filter((filtered) => {
                return (filtered.paymentMachine && bankInfo.paymentMachine && filtered.paymentMachine.name === bankInfo.paymentMachine.name && filtered.typeCode === bankInfo.typeCode) || (filtered.paymentMachine == null && item.key === 'C' && mapObj.machine === 'CASH')
              })
              .reduce((prev, next) => prev + next.amount, 0)
            : 0
        }
        return mapObj
      })
  } catch (error) {
    console.log('error', error)
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <BrowseTotal
        {...browseTotalProps}
        listEdc={groupByEdc}
        dataSource={arrByEdc}
      />
      <BrowseReturn {...browseReturnTotalProps} />
      {arr && arr.map((item, index) => {
        return (
          <Browse
            {...browseProps}
            dataSource={item}
            key={index}
            title={() => {
              const record = item && item.length > 0 ? item[0] : {}
              return (
                <div className="row">
                  <div style={{ width: '50%' }} className="header">
                    <div>{`${record.paymentMachine && record.paymentMachine.name ? record.paymentMachine.name : 'CASH'} details`}</div>
                  </div>
                  <div style={{ width: '50%' }} className="total">
                    <div>{`Total: ${numberFormat.numberFormatter(item.reduce((prev, next) => prev + next.amount, 0))}`}</div>
                  </div>
                </div>
              )
            }}

          />
        )
      })}
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  posPaymentReport: PropTypes.object
}

export default connect(({ loading, dashboard, paymentOpts, posPaymentReport, app, returnSalesDetail }) => ({ loading, dashboard, paymentOpts, posPaymentReport, app, returnSalesDetail }))(Report)
