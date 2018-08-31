import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Form from './Form'
import Filter from './Filter'
import Browse from './Browse'

const TabPane = Tabs.TabPane

const WorkOrder = ({ workorder, dispatch, loading }) => {
  const { activeKey, currentItem, pagination, start, end, q,
    modalFilter, status, listWOHeader, currentStep } = workorder

  const openCloseModalFilter = () => {
    dispatch({
      type: 'workorder/updateState',
      payload: {
        modalFilter: !modalFilter
      }
    })
  }

  const filterProps = {
    modalFilter,
    start,
    end,
    q,
    openCloseModalFilter,
    onResetDataFilter () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          status: [0, 1]
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname
      }))
    },
    onSubmitDataFilter (data) {
      openCloseModalFilter()
      if (!data.start && !data.end && !data.status && !data.nextCall && !data.postService) return false
      dispatch({
        type: 'workorder/updateState',
        payload: {
          status: data.status,
          start: data.start,
          end: data.end
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: data
      }))
    },
    onFilterPeriod (start, end) {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          status: [0, 1]
        }
      })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          start,
          end
        }
      }))
    },
    onSearchByKeyword (value) {
      const { query, pathname } = location
      if (value && value !== '') {
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            q: value
          }
        }))
      }
    }
  }

  const browseProps = {
    dataSource: listWOHeader,
    loading: loading.effects['workorder/queryWOHeader'],
    pagination,
    onChange (page) {
      const { query, pathname } = location
      let contentQuery = {
        ...query,
        page: page.current,
        pageSize: page.pageSize,
        start,
        end,
        status
      }
      if (start && end && !q) {
        dispatch(routerRedux.push({
          pathname,
          query: contentQuery
        }))
      } else {
        contentQuery = {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
          q
        }
        dispatch(routerRedux.push({
          pathname,
          query: contentQuery
        }))
      }
    },
    viewHeader (record) {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          currentItem: record,
          activeKey: '0'
        }
      })
      const { pathname } = location
      window.history.pushState('', '', pathname)
    }
  }

  const formProps = {
    currentStep
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} type="card">
        <TabPane tab="Form" key="0" disabled={_.isEmpty(currentItem)}>
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            (<div>
              <Filter {...filterProps} />
              <Browse {...browseProps} />
            </div>)
          }
        </TabPane>
      </Tabs>
    </div>
  )
}
export default connect(({ workorder, loading }) => ({ workorder, loading }))(WorkOrder)
