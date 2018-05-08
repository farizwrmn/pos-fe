/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, accountsReport, customergroup, app }) => {
  const { listTrans, from, to, date, productCode } = accountsReport
  const { listGroup } = customergroup
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    loading: loading.effects['accountsReport/queryARGroup'],
    storeInfo,
    user,
    from,
    to,
    productCode
  }

  const filterProps = {
    listTrans,
    listGroup,
    dataSource: listTrans,
    user,
    storeInfo,
    date,
    productCode,
    onListReset () {
      dispatch({
        type: 'accountsReport/setListNull'
      })
    },
    showCustomerGroup () {
      dispatch({
        type: 'customergroup/query'
      })
    },
    onDateChange (data) {
      dispatch({
        type: 'accountsReport/queryARGroup',
        payload: data
      })
      dispatch({
        type: 'accountsReport/updateState',
        payload: data
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
  loading: PropTypes.object,
  accountsReport: PropTypes.object,
  customergroup: PropTypes.object.isRequired
}

export default connect(({ accountsReport, customergroup, loading, app }) => ({ accountsReport, customergroup, loading, app }))(Report)
