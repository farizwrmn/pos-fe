import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { getConsignmentId } from 'utils/lstorage'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import ModalCommission from './ModalCommission'

const TabPane = Tabs.TabPane

function Vendor ({ consignmentVendor, consignmentOutlet, consignmentCategory, consignmentVendorCommission, dispatch, loading }) {
  const { list, selectedVendor, modalCommissionItem, modalCommissionVisible, lastVendor, activeKey, formType, pagination, q, modalState } = consignmentVendor
  const { list: categoryList } = consignmentCategory
  const { list: listVendorCommission } = consignmentVendorCommission
  const { list: listOutlet } = consignmentOutlet

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentVendor/updateState',
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

  const listProps = {
    formType,
    dataSource: list,
    pagination,
    loading: loading.effects['consignmentVendor/query'],
    edit (record) {
      changeTab('0')
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          selectedVendor: record,
          formType: 'edit'
        }
      })
      const consignmentId = getConsignmentId()
      dispatch({
        type: 'consignmentVendorCommission/query',
        payload: {
          outletId: consignmentId,
          vendorId: record.id
        }
      })
    },
    onFilterChange ({ pagination }) {
      const { current, pageSize } = pagination
      dispatch({
        type: 'consignmentVendor/query',
        payload: {
          q,
          current,
          pageSize
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'consignmentVendor/query',
        payload: {
          q: value
        }
      })
    }
  }

  const formProps = {
    formType,
    selectedVendor,
    lastVendor,
    categoryList,
    listVendorCommission,
    modalState,
    loading: (loading.effects['consignmentVendor/add']
      || loading.effects['consignmentVendor/edit']
      || loading.effects['consignmentVendor/resetPassword']),
    cancelEdit () {
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          selectedVendor: {},
          formType: 'add'
        }
      })
    },
    onClickAddCommission () {
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          modalCommissionVisible: true,
          modalCommissionItem: {
            commissionValue: selectedVendor.commissionValue
          }
        }
      })
    },
    add (data, resetFields) {
      dispatch({
        type: 'consignmentVendor/add',
        payload: {
          ...data,
          resetFields
        }
      })
    },
    edit (data, resetFields) {
      dispatch({
        type: 'consignmentVendor/edit',
        payload: {
          ...data,
          id: selectedVendor.id,
          resetFields
        }
      })
    },
    resetPassword (password) {
      dispatch({
        type: 'consignmentVendor/resetPassword',
        payload: {
          id: selectedVendor.id,
          password
        }
      })
    },
    handleModal () {
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          modalState: !modalState
        }
      })
    }
  }

  const modalCommissionProps = {
    visible: modalCommissionVisible,
    title: 'Add Commission',
    item: modalCommissionItem,
    listOutlet,
    onOk (data) {
      dispatch({
        type: 'consignmentVendorCommission/add',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          modalCommissionVisible: false,
          modalCommissionItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' &&
            <div>
              <Form {...formProps} />
              {modalCommissionVisible && <ModalCommission {...modalCommissionProps} />}
            </div>
          }
        </TabPane>
        <TabPane tab="List" key="1" >
          {activeKey === '1' &&
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
  consignmentVendor,
  consignmentCategory,
  consignmentOutlet,
  consignmentVendorCommission,
  dispatch,
  loading
}) => ({ consignmentVendor, consignmentOutlet, consignmentCategory, consignmentVendorCommission, dispatch, loading }))(Vendor)
