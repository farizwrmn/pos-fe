/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Browse from './Browse'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, fifoReport, app }) => {
  const { period, year, activeKey } = fifoReport
  let { listRekap } = fifoReport
  if (activeKey === '1') {
    listRekap = listRekap.filter(el => el.count !== 0)
  }
  const { user, storeInfo } = app

  const browseProps = {
    dataSource: listRekap
  }

  const filterProps = {
    activeKey,
    listRekap,
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
    onChangePeriod (month, yearPeriod) {
      dispatch({
        type: 'fifoReport/setPeriod',
        payload: {
          month,
          yearPeriod
        }
      })
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          period: month,
          year: yearPeriod,
          activeKey
        }
      }))
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'fifoReport/updateState',
      payload: {
        activeKey: key
      }
    })
    dispatch({
      type: 'fifoReport/setNull'
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Summary" key="0" >
          <Filter {...filterProps} />
          <Browse {...browseProps} />
        </TabPane>
        <TabPane tab="Balance" key="1" >
          <Filter {...filterProps} />
          <Browse {...browseProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  fifoReport: PropTypes.object
}

export default connect(({ fifoReport, loading, app }) => ({ fifoReport, loading, app }))(Report)
