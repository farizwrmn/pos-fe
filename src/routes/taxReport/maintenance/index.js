import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Form from './Form'

const TabPane = Tabs.TabPane

const Counter = ({ taxReportMaintenance, dispatch, loading, location }) => {
  const { modalType, currentItem, activeKey } = taxReportMaintenance

  const changeTab = (key) => {
    dispatch({
      type: 'taxReportMaintenance/changeTab',
      payload: { key }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({ type: 'taxReportMaintenance/updateState', payload: { list: [] } })
  }

  const formProps = {
    modalType,
    item: currentItem,
    loading,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmitSales (data) {
      dispatch({
        type: 'taxReportMaintenance/queryPos',
        payload: data
      })
    },
    onSubmitPurchase (data) {
      dispatch({
        type: 'taxReportMaintenance/queryPurchase',
        payload: data
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  taxReportMaintenance: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ taxReportMaintenance, loading, app }) => ({ taxReportMaintenance, loading, app }))(Counter)
