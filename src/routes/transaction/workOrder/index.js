import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Form from './Form'
import Filter from './Filter'
import Browse from './Browse'
import ModalUnit from './ModalUnit'
import ModalMember from './ModalMember'

const TabPane = Tabs.TabPane

const WorkOrder = ({ workorder, customer, customerunit, dispatch, location, loading }) => {
  const {
    activeKey,
    pagination,
    q,
    currentItem,
    modalFilter,
    status,
    formCustomFieldType,
    formMainType,
    listWOHeader,
    currentStep,
    listWorkOrderCategory,
    listCustomFields,
    modalAddUnit,
    modalCustomerVisible,
    modalCustomerAssetVisible
  } = workorder

  const { modalAddMember } = customer
  const { listUnit, unitItem, searchText } = customerunit
  const { listCustomer } = customer

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
      // dispatch({
      //   type: 'workorder/updateState',
      //   payload: data
      // })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...data,
          ...query
        }
      }))
    },
    onFilterPeriod (woDate) {
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
          woDate
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
        status
      }
      dispatch(routerRedux.push({
        pathname,
        query: contentQuery
      }))
    },
    viewHeader (record) {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          currentItem: record,
          activeKey: '0',
          currentStep: 0
        }
      })
      dispatch({
        type: 'workorder/setCheckList',
        payload: {
          woId: record.id
        }
      })
      const { pathname } = location
      window.history.pushState('', '', pathname)
    }
  }

  const changeTab = (key) => {
    const { pathname } = location
    dispatch({
      type: 'workorder/updateState',
      payload: {
        formMainType: 'add',
        listCustomFields: [],
        formCustomFieldType: true,
        currentItem: {},
        currentStep: 0,
        listWorkOrderCategory: [],
        listWorkOrderCategoryTemp: []
      }
    })
    dispatch({
      type: 'workorder/querySequence'
    })
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
  }

  const modaladdMemberProps = {
    item: customer.currentItem,
    modalAddMember,
    cancelMember () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalAddMember: false
        }
      })
    }
  }

  const modalAddUnitProps = {
    modalAddUnit,
    confirmSendUnit (data) {
      dispatch({
        type: 'customerunit/add',
        payload: data
      })
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalAddUnit: false
        }
      })
    },
    cancelUnit () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalAddUnit: false
        }
      })
    }
  }

  const formProps = {
    listCustomer,
    listUnit,
    searchText,
    formMainType,
    formCustomFieldType,
    transData: {
      ...currentItem,
      ...unitItem
    },
    loading: loading.effects['workorder/queryWOCategory'],
    loadingButton: loading,
    modalCustomerVisible,
    modalCustomerAssetVisible,
    dataSource: listWorkOrderCategory,
    listWorkOrderCategory,
    listCustomFields,
    dispatch,
    currentStep,
    handleAddMember () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalAddMember: true
        }
      })
    },
    handleShowMember () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalCustomerVisible: true
        }
      })
      dispatch({
        type: 'customer/query'
      })
    },
    handleShowMemberAsset () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          modalCustomerAssetVisible: true
        }
      })
    },
    CancelWo () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          formMainType: 'add',
          formCustomFieldType: true
        }
      })
      dispatch({
        type: 'workorder/querySequence'
      })
      dispatch({
        type: 'queryWOCategory',
        payload: {
          field: 'id,productCategoryId,categoryCode,categoryName,categoryParentId,categoryParentCode,categoryParentName'
        }
      })
      dispatch({
        type: 'queryWOCustomFields',
        payload: {
          field: 'id,fieldName,sortingIndex,fieldParentId,fieldParentName'
        }
      })
    },
    WorkOrder () {
      dispatch({
        type: 'workorder/nextStep',
        payload: 0
      })
    },
    customField () {
      dispatch({
        type: 'workorder/nextStep',
        payload: 1
      })
    },
    onSubmitWo (data, check) {
      dispatch({
        type: 'workorder/addWorkOrder',
        payload: {
          header: data,
          check
        }
      })
    },
    onSubmitFields (data) {
      dispatch({
        type: 'workorder/addWorkOrderFields',
        payload: {
          detail: data
        }
      })
    },
    nextStep (key) {
      dispatch({
        type: 'workorder/nextStep',
        payload: key
      })
    },
    search (value, type) {
      const searchValue = !!value
      if (!searchValue) return
      if (value && value !== '') {
        switch (type) {
          case 'memberId':
            dispatch({
              type: 'customer/query',
              payload: {
                q: value,
                pageSize: 10
              }
            })
            break
          default:
        }
      }
    },
    getCustomerUnit (data) {
      const dataCustomerUnit = !!data
      if (!dataCustomerUnit) return
      if (data.title) {
        dispatch({
          type: 'customerunit/query',
          payload: {
            code: data.title
          }
        })
      }
    },
    resetAssetList () {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          listUnit: []
        }
      })
    },
    editListItem (id, value, type) {
      const newListCategory = listWorkOrderCategory.map((x) => {
        if (x.id === Number(id)) {
          if (type === 'radio') {
            return {
              ...x,
              value
            }
          } else if (type === 'input') {
            return {
              ...x,
              memo: value
            }
          }
        }
        return x
      })
      dispatch({
        type: 'workorder/updateState',
        payload: {
          listWorkOrderCategory: newListCategory
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {modalAddUnit && <ModalUnit {...modalAddUnitProps} />}
      {modalAddMember && <ModalMember {...modaladdMemberProps} />}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab={`Form (${(formMainType || '').toUpperCase()})`} key="0">
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

WorkOrder.propTypes = {
  customerunit: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  workorder: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default connect(({ workorder, customer, customerunit, loading }) => ({ workorder, customer, customerunit, loading }))(WorkOrder)
