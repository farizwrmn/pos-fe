/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Modal from './Modal'
import ModalClose from './ModalClose'

const Period = ({ location, dispatch, period, loading, app }) => {
  const { list, pagination, modalVisible, visiblePopover,
    disabledItem, modalType, modalEndVisible, accountActive, searchVisible, periodDate, accountNumber } = period
  const { user } = app
  const { pageSize } = pagination

  const modalProps = {
    visible: modalVisible,
    visiblePopover: visiblePopover,
    disabledItem: disabledItem,
    user,
    modalType,
    periodDate,
    accountNumber,
    maskClosable: false,
    confirmLoading: loading.effects['period/update'],
    title: `${modalType === 'add' ? 'New Period' : 'Close Period'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `period/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'period/modalHide',
      })
    },
  }

  const modalEndProps = {
    visible: modalEndVisible,
    user,
    modalType,
    periodDate,
    accountActive,
    maskClosable: false,
    confirmLoading: loading.effects['period/update'],
    title: `${modalType === 'add' ? 'New Period' : 'Close Period'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `period/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'period/modalCloseHide',
      })
    },
  }

  const browseProps = {
    dataSource: list,
    size: 'small',
    loading: loading.effects['period/queryPeriod'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onStartPeriod () {
      dispatch({
        type: 'period/modalShow',
        payload: {
          modalType: 'add',
          periodDate: {
            startDate: moment().format('YYYY/MM/DD hh:mm:ss')
          },
        },
      })
    },
    onEndPeriod () {
      dispatch({
        type: 'period/modalCloseShow',
        payload: {
          modalType: 'end',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'period/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item,
        },
      })
    },
    onSearchShow () { dispatch({ type: 'period/searchShow' }) },
  }

  const filterProps = {
    visiblePanel: searchVisible,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/setting/periods',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/setting/periods',
      }))
    },
    onSearchHide () { dispatch({ type: 'period/searchHide'}) },
  }

  return (
    <div className="content-inner">
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
      {modalEndVisible && <ModalClose {...modalEndProps} />}
    </div>
  )
}

Period.propTypes = {
  period: PropTypes.isRequired,
  app: PropTypes.isRequired,
  location: PropTypes.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.isRequired,
}

export default connect(({ loading, app, period }) => ({ loading, app, period }))(Period)
