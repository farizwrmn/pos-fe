import React from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, message, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { numberFormat } from 'utils'
import Filter from './Filter'
import Summary from './Summary'
import Detail from './Detail'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const numberFormatter = numberFormat.numberFormatter
const TabPane = Tabs.TabPane

function JournalReport ({ consignmentJournalReport, dispatch, app }) {
  const {
    list,
    summary,
    paymentMethod,
    balanceList,
    selectedBalance,
    activeKey,
    detailActiveKey,
    dateRange,
    consignmentId
  } = consignmentJournalReport
  const { user, storeInfo } = app

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentJournalReport/updateState',
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
    balanceList,
    selectedBalance,
    dateRange,
    getData (from, to) {
      message.info('Loading!')
      dispatch({
        type: 'consignmentJournalReport/querySummary',
        payload: {
          from,
          to
        }
      })
    },
    onChangeDate (value) {
      dispatch({
        type: 'consignmentJournalReport/updateState',
        payload: {
          dateRange: value
        }
      })
      dispatch({
        type: 'consignmentJournalReport/queryLovBalance',
        payload: {
          dateRange: value
        }
      })
    },
    updateCurrentBalance (value) {
      const balance = balanceList.filter(filtered => filtered.id === value)[0]
      dispatch({
        type: 'consignmentJournalReport/updateState',
        payload: {
          selectedBalance: balance
        }
      })
    }
  }

  const summaryProps = {
    summary,
    numberFormatter,
    paymentMethod
  }

  const detailProps = {
    list,
    paymentMethod,
    detailActiveKey,
    numberFormatter,
    changeTab (key) {
      dispatch({
        type: 'consignmentJournalReport/updateState',
        payload: {
          detailActiveKey: key
        }
      })
    }
  }

  const printProps = {
    summary: summary[0],
    paymentMethod,
    dataSource: list,
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
              <Summary {...summaryProps} />
              {list && list.length ? <Detail {...detailProps} /> : null}
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentJournalReport,
  consignmentOutlet,
  dispatch,
  app
}) => ({ consignmentJournalReport, consignmentOutlet, dispatch, app }))(JournalReport)
