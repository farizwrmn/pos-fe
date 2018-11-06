import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Form from './Form'

const TabPane = Tabs.TabPane

const Counter = ({ template, dispatch, location }) => {
  const { modalType, currentItem, activeKey } = template

  const changeTab = (key) => {
    dispatch({
      type: 'template/changeTab',
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
    dispatch({ type: 'template/updateState', payload: { listAccountCode: [] } })
  }

  const formProps = {
    modalType,
    item: currentItem,
    button: 'Update',
    onSubmit (data) {
      dispatch({
        type: 'template/edit',
        payload: {
          id: 'Invoice',
          data
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs
        activeKey={activeKey}
        onChange={key => changeTab(key)}
        tabPosition="left"
      >
        <TabPane tab="Invoice" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        {/* <TabPane tab="Report" key="1" >
          {activeKey === '1' && <Form {...formProps} />}
        </TabPane> */}
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  template: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ template, loading }) => ({ template, loading }))(Counter)
