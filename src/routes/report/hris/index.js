import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import EmployeeCheckin from './EmployeeCheckin'

const TabPane = Tabs.TabPane

const Employee = ({ employee, dispatch, location }) => {
  const { activeKey } = employee

  const changeTab = (key) => {
    dispatch({
      type: 'employee/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        disable: '',
        currentItem: {}
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({
      type: 'employee/querySequence',
      payload: {
        seqCode: 'EMP',
        type: 1 // storeId
      }
    })
    dispatch({
      type: 'employee/resetEmployeeList'
    })
  }

  const reportProps = {

  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="HRIS" key="0">
          <EmployeeCheckin {...reportProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Employee.propTypes = {
  employee: PropTypes.object,
  misc: PropTypes.object.isRequired,
  jobposition: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ employee, store, misc, jobposition, city, loading, app }) => ({ employee, store, misc, jobposition, city, loading, app }))(Employee)
