/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, accountPayableReport, app, loading }) => {
  const { listTrans, to } = accountPayableReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    loading: loading.effects['accountPayableReport/querySupplier'],
    listTrans,
    storeInfo,
    user
  }

  const filterProps = {
    listTrans,
    user,
    to,
    storeInfo,
    loading,
    onListReset () {
      dispatch({
        type: 'accountPayableReport/setListNull'
      })
    },
    onDateChange (to) {
      dispatch({
        type: 'accountPayableReport/querySupplier',
        payload: {
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
  accountPayableReport: PropTypes.object,
  userStore: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, accountPayableReport, app }) => ({ loading, accountPayableReport, app }))(Report)
