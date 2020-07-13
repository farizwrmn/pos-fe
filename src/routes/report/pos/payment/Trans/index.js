/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Browse from './Browse'
import BrowseTotal from './BrowseTotal'
import Filter from './Filter'

const Report = ({ dispatch, paymentOpts, posPaymentReport, loading, app }) => {
  const { listTrans, from, to, productCode } = posPaymentReport
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

  const browseTotalProps = {
    listOpts,
    dataSource: [],
    pagination: false
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    from,
    to,
    productCode,
    onListReset () {
      dispatch({
        type: 'posPaymentReport/setListNull'
      })
    },
    onDateChange (from, to) {
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

  let groupBy = (xs) => {
    return xs
      .reduce((prev, next) => {
        if (next.cost) {
          (prev[next.cost.machineId] = prev[next.cost.machineId] || []).push(next)
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

  let groubedByTeam = groupBy(listTrans, 'cost.costBank.bankName')
  let groupByEdc = groupByKey(listTrans, 'machine')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  console.log('groupByEdc', listOpts, groupByEdc)

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <BrowseTotal {...browseTotalProps} />
      {arr && arr.map((item, index) => {
        return (
          <Browse
            {...browseProps}
            dataSource={item}
            key={index}
            title={() => {
              const record = item && item.length > 0 ? item[0] : {}
              return (
                <div className="header">
                  <div>{`${record.cost && record.cost.costMachine ? record.cost.costMachine.name : record && record.paymentOption ? record.paymentOption.typeName : 'CASH'} details`}</div>
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

export default connect(({ loading, paymentOpts, posPaymentReport, app }) => ({ loading, paymentOpts, posPaymentReport, app }))(Report)
