import React from 'react'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Filter from './Filter'
import Browse from './Browse'
import Form from './Form'

const TabPane = Tabs.TabPane

const FollowUp = ({
  followup,
  dispatch,
  loading
}) => {
  const { activeKey, currentItem, listFollowUpHeader, pagination, start, end, q,
    modalFilter, currentStep, listTransactionDetail, modalFeedback, currentFeedback,
    itemFeedbacks, modalPending, modalAcceptOffer, modalDenyOffer, status } = followup
  const changeTab = (key) => {
    if (key === '1') {
      dispatch({
        type: 'followup/getDate',
        payload: { start, end, status: [0, 2, 3, 4] }
      })
    }
    dispatch({
      type: 'followup/updateState',
      payload: {
        activeKey: key,
        q: '',
        currentItem: {},
        currentFeedback: {},
        itemFeedbacks: [],
        pending: false
      }
    })
  }

  const openCloseModalFilter = () => {
    dispatch({
      type: 'followup/updateState',
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
    onSubmitDataFilter (data) {
      openCloseModalFilter()
      if (!data.start && !data.end && !data.status && !data.nextCall && !data.postService) return false
      dispatch({
        type: 'followup/updateState',
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
        type: 'followup/updateState',
        payload: {
          status: [0, 2, 3, 4]
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
    dataSource: listFollowUpHeader,
    loading: loading.effects['followup/queryHeader'],
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
    updateHeaderStatus (id) {
      dispatch({
        type: 'followup/updateStatusToZero',
        payload: { posId: id }
      })
    }
  }

  const formProps = {
    currentStep,
    memberInfo: currentItem,
    listTransactionDetail,
    modalFeedback,
    currentFeedback,
    itemFeedbacks,
    modalPending,
    modalAcceptOffer,
    modalDenyOffer,
    updateHeaderStatus (id) {
      dispatch({
        type: 'followup/updateStatusToTwo',
        payload: { id }
      })
    },
    showModalFeedback (record) {
      let current
      if (record) current = itemFeedbacks.find(x => x.posDetailId === record.id)
      if (current) {
        current = Object.assign({ id: record.id, item: record.item, customerSatisfaction: current.customerSatisfaction })
      }
      dispatch({
        type: 'followup/updateState',
        payload: {
          currentFeedback: current || record,
          modalFeedback: !modalFeedback
        }
      })
    },
    submitFeedbackItem (record) {
      dispatch({
        type: 'followup/saveFeedback',
        payload: record
      })
    },
    updateNextServiceAndCustomerSatisfaction (header) {
      dispatch({
        type: 'followup/updateNextServiceAndCustomerSatisfaction',
        payload: {
          id: currentItem.id,
          data: { header, detail: itemFeedbacks }
        }
      })
    },
    nextStep (key) {
      dispatch({ type: 'followup/nextStep', payload: key })
      if (key === 2) {
        dispatch({
          type: 'promo/query',
          payload: {
            storeId: lstorage.getCurrentUserStore(),
            name: null
          }
        })
        dispatch({
          type: 'productstock/query',
          payload: {
            page: 1,
            pageSize: 5,
            order: '-createdAt'
          }
        })
        dispatch({
          type: 'service/query',
          payload: {
            page: 1,
            pageSize: 5,
            order: '-createdAt'
          }
        })
      }
    },
    showModalPending () {
      dispatch({
        type: 'followup/updateState',
        payload: {
          modalPending: !modalPending
        }
      })
    },
    showModalAcceptOffer () {
      dispatch({
        type: 'followup/updateState',
        payload: {
          modalAcceptOffer: !modalAcceptOffer
        }
      })
    },
    showModalDenyOffer () {
      dispatch({
        type: 'followup/updateState',
        payload: {
          modalDenyOffer: !modalDenyOffer
        }
      })
    },
    onSubmitPending (data) {
      dispatch({
        type: 'followup/updatePending',
        payload: { id: currentItem.id, data: { data } }
      })
    },
    onSubmitAcceptOffer (data) {
      dispatch({
        type: 'followup/updateAcceptOffering',
        payload: { id: currentItem.id, data: { data } }
      })
    },
    onSubmitDenyOffer (data) {
      dispatch({
        type: 'followup/updateDenyOffering',
        payload: { id: currentItem.id, data: { data } }
      })
    }
  }

  return (
    <div className="content-inner" style={{ clear: 'both' }}>
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Form" key="0" disabled={_.isEmpty(currentItem)}>
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            (<div><Filter {...filterProps} />
              <Browse {...browseProps} /></div>)
          }
        </TabPane>
      </Tabs>
    </div>
  )
}
export default connect(({ followup, loading, promo, productstock, service }) => ({ followup, loading, promo, productstock, service }))(FollowUp)
