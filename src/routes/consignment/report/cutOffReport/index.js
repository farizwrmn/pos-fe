import React from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, Tabs } from 'antd'
import Filter from './Filter'
import List from './List'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const TabPane = Tabs.TabPane

function CutOffReport ({ consignmentCutOffReport, consignmentOutlet, dispatch, app, loading }) {
  const { activeKey, list, periodList, consignmentId, period } = consignmentCutOffReport
  const { list: outletList } = consignmentOutlet
  const { user } = app

  const changeTab = () => {
  }

  if (!consignmentId) {
    return (
      <div>Consignment not linked to this store, please contact your administrator</div>
    )
  }

  const listProps = {
    list,
    outletList,
    loading: loading.effects['consignmentCutOffReport/query'],
    setCutOffReadyForEmail (cutOffDetailId) {
      dispatch({
        type: 'consignmentCutOffReport/setCutOffReadyForEmail',
        payload: {
          id: cutOffDetailId
        }
      })
    }
  }

  const filterProps = {
    period,
    periodList,
    loading: loading.effects['consignmentCutOffReport/query'],
    getData (data) {
      dispatch({
        type: 'consignmentCutOffReport/query',
        payload: {
          period: data.period
        }
      })
    }
  }

  const printProps = {
    dataSource: list,
    user,
    period
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
  consignmentCutOffReport,
  consignmentOutlet,
  dispatch,
  app,
  loading
}) => ({ consignmentCutOffReport, consignmentOutlet, dispatch, app, loading }))(CutOffReport)
