/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Modal from './Modal'

const Period = ({ location, dispatch, period, loading, app }) => {
  const { list, pagination, currentItem, modalVisible, visiblePopover,
    disabledItem, modalType } = period
  const { user } = app

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    visiblePopover: visiblePopover,
    disabledItem: disabledItem,
    user,
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

  const browseProps = {
    dataSource: list,
    size: 'small',
    loading: loading.effects['misc/query'],
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
    onAddItem () {
      dispatch({
        type: 'misc/modalShow',
        payload: {
          modalType: 'add',
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

  return (
    <div className="content-inner">
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Period.propTypes = {
  period: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading, app, period }) => ({ loading, app, period }))(Period)
