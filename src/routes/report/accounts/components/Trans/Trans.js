/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, accountsReport, loading, app }) => {
  const { listTrans, from, to, productCode } = accountsReport
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountsReport/queryTrans'],
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
        type: 'accountsReport/setListNull'
      })
    },
    onDateChange (from, to) {
      dispatch({
        type: 'accountsReport/queryTrans',
        payload: {
          from,
          to
        }
      })
      dispatch({
        type: 'accountsReport/setDate',
        payload: {
          from,
          to
        }
      })
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
  accountsReport: PropTypes.object
}

export default connect(({ loading, accountsReport, app }) => ({ loading, accountsReport, app }))(Report)
