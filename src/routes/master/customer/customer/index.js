import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ModalMobile from './ModalMobile'
import Tab from './Tab'

const Customer = ({ customer, loading, dispatch, location, app }) => {
  const { list, pagination, display, modalMobile, isChecked, modalType, currentItem, activeKey,
    show, modalVisible, dataCustomer, listPrintAllCustomer, showPDFModal, mode, changed,
    customerLoading, modalAddUnit, addUnit, checkMember } = customer
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      // dispatch({
      //   type: 'customer/query',
      //   payload: {
      //     ...value
      //   }
      // })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value,
          page: 1
        }
      }))
    },
    switchIsChecked () {
      dispatch({
        type: 'customer/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      const { query, pathname } = location
      const { q, createdAt, page, ...other } = query
      dispatch(routerRedux.push({
        pathname,
        query: {
          page: 1,
          ...other
        }
      }))
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['customer/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    editItem (item) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'customergroup/query'
      })
      dispatch({
        type: 'customertype/query'
      })
      dispatch({
        type: 'city/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'customer/delete',
        payload: id
      })
    }
  }

  const modalMobileProps = {
    visible: modalMobile,
    onSearch (data) {
      dispatch({
        type: 'customer/queryMember',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalMobile: false
        }
      })
    }
  }

  const tabProps = {
    activeKey,
    list,
    listPrintAllCustomer,
    changed,
    mode,
    customerLoading,
    showPDFModal,
    changeTab (key) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      const { query, pathname } = location
      switch (key) {
        case 1:
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...query,
              activeKey: key
            }
          }))
          break
        default:
          dispatch(routerRedux.push({
            pathname,
            query: {
              activeKey: key
            }
          }))
      }
    },
    onShowHideSearch () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          show: !show
        }
      })
    },
    onShowPDFModal (mode) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          showPDFModal: true,
          mode
        }
      })
    },
    onHidePDFModal () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          showPDFModal: false,
          changed: false,
          listPrintAllCustomer: []
        }
      })
    },
    getAllCustomer () {
      if (mode === 'pdf') {
        dispatch({
          type: 'customer/checkLengthOfData',
          payload: {
            page: 51,
            pageSize: 10
          }
        })
      } else {
        dispatch({
          type: 'customer/queryAllCustomer',
          payload: {
            type: 'all'
          }
        })
      }
    }
  }
  const modalProps = {
    customer,
    location,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const mobileProps = {
    customer,
    location,
    modalVisible,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    checkMember,
    onCancel () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false
        }
      })
    },

    checkMemberCardId (payload) {
      dispatch({
        type: 'customer/queryMemberStatus',
        payload: {
          memberCardId: payload
        }
      })
    },
    resetMemberStatus () {
      dispatch({
        type: 'customer/resetMemberStatus'
      })
    },
    enabledItem (mode, state) {
      dispatch({
        type: 'customer/enabledItem',
        payload: {
          mode,
          state
        }
      })
    },
    activateMember (payload) {
      dispatch({
        type: 'customer/activateMember',
        payload
      })
    }
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...modalProps,
    ...listProps,
    ...mobileProps,
    modalType,
    modalAddUnit,
    addUnit,
    dataCustomer,
    item: currentItem,
    openModal () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: true
        }
      })
      dispatch({
        type: 'customer/query'
      })
    },
    onActivate (data) {
      dispatch({
        type: 'customer/activate',
        payload: {
          ...data
        }
      })
    },
    clickBrowse () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          activeKey: '1'
        }
      })
    },
    confirmAddUnit () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalAddUnit: false,
          addUnit: {
            modal: true,
            info: addUnit.info
          }
        }
      })
    },
    confirmSendUnit (data) {
      dispatch({
        type: 'customerunit/add',
        payload: data
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalAddUnit: true,
          addUnit: {
            modal: false,
            info: addUnit.info
          }
        }
      })
    },
    cancelUnit () { dispatch({ type: 'customer/cancelSendUnit' }) }
  }

  return (
    <div className="content-inner">
      <Tab {...formProps} />
      <ModalMobile {...modalMobileProps} />
    </div>
  )
}

Customer.propTypes = {
  customer: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customer, customerunit, loading, app }) => ({ customer, customerunit, loading, app }))(Customer)
