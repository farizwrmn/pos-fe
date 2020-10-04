/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, fifoReport, productstock, loading, app }) => {
  const { listRekap, from, to } = fifoReport
  const { list } = productstock
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listRekap,
    loading: loading.effects['fifoReport/queryHistory'],
    storeInfo,
    user,
    onListReset () {
      dispatch({
        type: 'fifoReport/setNull'
      })
    }
  }

  let timeout
  const filterProps = {
    listRekap,
    user,
    dispatch,
    loading,
    storeInfo,
    from,
    to,
    // productCode,
    // productName,
    list,
    onListReset () {
      dispatch({
        type: 'fifoReport/setNull'
      })
    },
    showLov (models, data) {
      if (!data) {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5
          }
        })
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      timeout = setTimeout(() => {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5,
            ...data
          }
        })
      }, 400)
    },
    onOk (data) {
      dispatch({
        type: 'fifoReport/queryHistory',
        payload: {
          from,
          to,
          productId: data.productId
        }
      })
    },
    onChangePeriod (from, to) {
      dispatch({
        type: 'fifoReport/updateState',
        payload: {
          from,
          to
        }
      })
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
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

Report.propTypes = {
  dispatch: PropTypes.func,
  app: PropTypes.object,
  fifoReport: PropTypes.object
}

export default connect(({ fifoReport, productstock, loading, app }) => ({ fifoReport, productstock, loading, app }))(Report)
