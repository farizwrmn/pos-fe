/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posPaymentReport, loading, app }) => {
  const { listTrans, from, to, productCode } = posPaymentReport
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['posPaymentReport/query'],
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    from,
    to,
    productCode
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

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  posPaymentReport: PropTypes.object
}

export default connect(({ loading, posPaymentReport, app }) => ({ loading, posPaymentReport, app }))(Report)
