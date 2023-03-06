import React from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, Tabs } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import Filter from './Filter'
import List from './List'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const TabPane = Tabs.TabPane

function RentReport ({ consignmentRentReport, dispatch, app, loading }) {
  const { list, activeKey, dateRange, pagination, consignmentId } = consignmentRentReport
  const { user } = app

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentRentReport/updateState',
      payload: {
        activeKey: key
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
  }

  if (!consignmentId) {
    return (
      <div>Consignment not linked to this store, please contact your administrator</div>
    )
  }

  const filterProps = {
    dateRange,
    loading: loading.effects['consignmentRentReport/query'],
    changeTime (time) {
      dispatch({
        type: 'consignmentRentReport/updateState',
        payload: {
          dateRange: time
        }
      })
    },
    getData () {
      const from = moment(dateRange[0]).format('YYYY-MM-DD')
      const to = moment(dateRange[1]).format('YYYY-MM-DD')
      dispatch({
        type: 'consignmentRentReport/query',
        payload: {
          from,
          to
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['consignmentRentReport/query'],
    onFilterChange ({ pagination }) {
      dispatch({
        type: 'consignmentRentReport/updateState',
        payload: {
          pagination
        }
      })
    }
  }


  const printProps = {
    dataSource: list,
    user,
    dateRange
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = (<div>
    <Dropdown overlay={menu}>
      <Button style={{ marginLeft: 8 }}>
        <Icon type="printer" /> Print
      </Button>
    </Dropdown>
  </div>)

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card" tabBarExtraContent={moreButtonTab}>
        <TabPane tab="Report" key="0" >
          {activeKey === '0' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentRentReport,
  consignmentOutlet,
  dispatch,
  app,
  loading
}) => ({ consignmentRentReport, consignmentOutlet, dispatch, app, loading }))(RentReport)
