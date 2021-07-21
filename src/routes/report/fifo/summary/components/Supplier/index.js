/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, store, purchase, fifoReport, loading, app }) => {
  const { listStoreLov } = store
  const { listSupplier } = purchase
  const { period, year, activeKey } = fifoReport
  let { listSupp } = fifoReport
  const { user, storeInfo } = app

  const browseProps = {
    dataSource: listSupp,
    listStoreLov,
    loading: loading.effects['fifoReport/queryInAdj']
  }

  const filterProps = {
    listSupplier,
    activeKey,
    listRekap: listSupp,
    user,
    dispatch,
    storeInfo,
    period,
    year,
    onListReset () {
      dispatch({
        type: 'fifoReport/setNull'
      })
    },
    onChangePeriod (data) {
      dispatch({
        type: 'fifoReport/queryFifoSupplierId',
        payload: {
          supplierId: data.supplierId
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

Report.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  purchase: PropTypes.object,
  store: PropTypes.object,
  fifoReport: PropTypes.object
}

export default connect(({ store, purchase, fifoReport, loading, app }) => ({ store, purchase, fifoReport, loading, app }))(Report)
