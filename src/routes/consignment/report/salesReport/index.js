import React from 'react'
import { connect } from 'dva'
import { Button, Col, Dropdown, Icon, Menu, Row, Tabs } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import Filter from './Filter'
import List from './List'
import Summary from './Summary'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

function SalesReport ({ consignmentSalesReport, dispatch, app, loading }) {
  const {
    list,
    activeKey,

    vendorList,
    selectedVendor,
    consignmentId,

    dateRange,
    pagination
  } = consignmentSalesReport
  const { user, storeInfo } = app

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentSalesReport/updateState',
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

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['consignmentSalesReport/query'],
    onFilterChange ({ pagination }) {
      dispatch({
        type: 'consignmentSalesReport/updateState',
        payload: {
          pagination
        }
      })
    }
  }

  const filterProps = {
    dateRange,
    vendorList,
    selectedVendor,
    getData () {
      const from = moment(dateRange[0]).format('YYYY-MM-DD')
      const to = moment(dateRange[1]).format('YYYY-MM-DD')
      dispatch({
        type: 'consignmentSalesReport/query',
        payload: {
          from,
          to,
          vendorId: selectedVendor.id
        }
      })
    },
    selectVendor (value) {
      const vendor = vendorList.filter(record => record.id === value)[0]
      dispatch({
        type: 'consignmentSalesReport/updateState',
        payload: {
          selectedVendor: vendor
        }
      })
    },
    searchVendor (value) {
      dispatch({
        type: 'consignmentSalesReport/queryVendor',
        payload: {
          q: value
        }
      })
    },
    updateDateRange (value) {
      dispatch({
        type: 'consignmentSalesReport/updateState',
        payload: {
          dateRange: value
        }
      })
    }
  }

  const summaryProps = {
    list,
    pagination,
    loading: loading.effects['consignmentSalesReport/query']
  }

  const printProps = {
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
              <Row style={{ marginBottom: '10px' }}>
                <Col span={8}>
                  {selectedVendor && selectedVendor.id &&
                    (
                      <div style={{ padding: '8px', fontSize: '16px', fontWeight: 'bolder' }}>
                        {(String(selectedVendor.id)).toUpperCase()} - {selectedVendor.name.toUpperCase()}
                      </div>
                    )}
                  {list && list.length > 0 && <Summary {...summaryProps} />}
                </Col>
                <Col span={4} />
                <Col span={12}>
                  <Filter {...filterProps} />
                </Col>
              </Row>
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentSalesReport,
  dispatch,
  app,
  loading
}) => ({ consignmentSalesReport, dispatch, app, loading }))(SalesReport)
