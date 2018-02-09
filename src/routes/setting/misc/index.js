import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'
import Modal from './Modal'

const Misc = ({ location, dispatch, misc, loading }) => {
  const { list, pagination, currentItem, modalVisible, searchVisible, visiblePopover,
    disabledItem, modalType, selectedRowKeys, disableMultiSelect } = misc
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    visiblePopover,
    disabledItem,
    maskClosable: false,
    confirmLoading: loading.effects['misc/update'],
    title: `${modalType === 'add' ? 'Add Misc' : 'Edit Misc'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `misc/${modalType}`,
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'misc/modalHide'
      })
    },
    modalPopoverVisible () {
      dispatch({
        type: 'misc/modalPopoverVisible'
      })
    },
    modalPopoverClose () {
      dispatch({
        type: 'misc/modalPopoverClose'
      })
    },
    modalButtonCancelClick () {
      dispatch({ type: 'misc/modalHide' })
    },
    modalButtonSaveClick (id, name, data) {
      dispatch({
        type: `misc/${modalType}`,
        payload: {
          id,
          name,
          data
        }
      })
    }
  }

  const browseProps = {
    dataSource: list,
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
          pageSize: page.pageSize
        }
      }))
    },
    onAddItem () {
      dispatch({
        type: 'misc/modalShow',
        payload: {
          modalType: 'add'
        }
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'misc/modalShow',
        payload: {
          modalType: 'edit',
          currentItem: item
        }
      })
    },
    onDeleteItem (id, name) {
      dispatch({
        type: 'misc/delete',
        payload: {
          id,
          name
        }
      })
    },
    onDeleteBatch (selectedRowKeys) {
      dispatch({
        type: 'misc/deleteBatch',
        payload: {
          userId: selectedRowKeys
        }
      })
    },
    onSearchShow () { dispatch({ type: 'misc/searchShow' }) },
    modalPopoverClose () {
      dispatch({
        type: 'misc/modalPopoverClose'
      })
    },
    size: 'small'
  }
  Object.assign(browseProps, disableMultiSelect ? null :
    { rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'misc/updateState',
          payload: {
            selectedRowKeys: keys
          }
        })
      }
    } }
  )

  const filterProps = {
    visiblePanel: searchVisible,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize
        }
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/master/user',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword
        }
      })) : dispatch(routerRedux.push({
        pathname: '/master/user'
      }))
    },
    onSearchHide () { dispatch({ type: 'misc/searchHide' }) }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Misc.propTypes = {
  misc: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}

export default connect(({ misc, loading }) => ({ misc, loading }))(Misc)
