import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Dropdown, Icon, Button, Menu } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import Filter from './Filter'
import List from './List'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const CustomerHistory = ({ customerReport, customer, service, dispatch, app, loading }) => {
  const { modalVisible, listPoliceNo, customerInfo, listHistory, from, to } = customerReport
  const { list } = customer
  const { listServiceType } = service
  const { user, storeInfo } = app
  const activeTabKey = '1'
  const modalProps = {
    customer,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const filterProps = {
    listPoliceNo,
    listServiceType,
    modalVisible,
    customerInfo,
    ...modalProps,
    openModal () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: true
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: '',
          listCustomer: list
        }
      })
    },
    onResetClick () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          listPoliceNo: [],
          customerInfo: {},
          listHistory: [],
          from: '',
          to: ''
        }
      })
    },
    resetHistory () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          listHistory: [],
          listPoliceNo: [],
          from: '',
          to: ''
        }
      })
    },
    onSearchClick (memberCode, data) {
      let fromDate = null
      let toDate = null
      if (data.period ? data.period[0] : false) {
        fromDate = moment(data.period[0]).format('YYYY-MM-DD')
        toDate = moment(data.period[1]).format('YYYY-MM-DD')
      }
      dispatch({
        type: 'customerReport/query',
        payload: {
          memberCode,
          policeNo: data.policeNo,
          from: fromDate,
          to: toDate,
          serviceType: data.serviceTypeId,
          mode: 'detail'
        }
      })
    }
  }

  const listProps = {
    dataSource: listHistory,
    loading: loading.effects['customerReport/query'],
    style: { marginTop: 15 }
  }

  const printProps = {
    listHistory,
    user,
    storeInfo,
    from,
    to
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  let moreButtonTab
  switch (activeTabKey) {
    case '1':
      if (listHistory.length > 0) {
        moreButtonTab = (<Dropdown overlay={menu}>
          <Button>
            <Icon type="printer" /> Print
        </Button>
        </Dropdown>)
      }
      break
    default:
      break
  }

  return (
    <div className="content-inner">
      <Tabs defaultActiveKey={activeTabKey} type="card" tabBarExtraContent={moreButtonTab}>
        <TabPane tab="History" key="1">
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

CustomerHistory.propTypes = {
  customerReport: PropTypes.object,
  customer: PropTypes.object,
  service: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.object
}

export default connect(({ customerReport, customer, service, app, loading }) => ({ customerReport, customer, service, app, loading }))(CustomerHistory)

