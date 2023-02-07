import React from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, Tabs } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import Filter from './Filter'
import Profit from './Profit'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const TabPane = Tabs.TabPane

function ProfitReport ({ consignmentProfitReport, consignmentVendor, dispatch, app }) {
  const { activeKey, dateRange, summary, consignmentId } = consignmentProfitReport
  const { list: vendorList, selectedVendor } = consignmentVendor
  const { user, storeInfo } = app

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentProfitReport/updateState',
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
    vendorList,
    selectedVendor,
    dateRange,
    changeVendor (vendorId) {
      const vendor = vendorList.filter(filtered => filtered.id === vendorId)[0]
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          selectedVendor: vendor
        }
      })
    },
    changeTime (time) {
      console.log('time', time)
      dispatch({
        type: 'consignmentProfitReport/updateState',
        payload: {
          dateRange: time
        }
      })
    },
    getData () {
      const from = moment(dateRange[0]).format('YYYY-MM-DD')
      const to = moment(dateRange[1]).format('YYYY-MM-DD')
      dispatch({
        type: 'consignmentProfitReport/query',
        payload: {
          vendorId: selectedVendor.id,
          from,
          to
        }
      })
    },
    onSearchVendor (value) {
      console.log('onSearchVendor', value)
      dispatch({
        type: 'consignmentVendor/query',
        payload: {
          q: value
        }
      })
    }
  }

  const profitProps = {
    summary
  }


  const printProps = {
    dataSource: [],
    summary,
    selectedVendor,
    user,
    storeInfo
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
              {summary && summary.total && <Profit {...profitProps} />}
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentProfitReport,
  consignmentVendor,
  dispatch,
  app
}) => ({ consignmentProfitReport, consignmentVendor, dispatch, app }))(ProfitReport)
