import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const CustomerType = ({ customertype, loading, dispatch, location }) => {
  const { listType, listSellprice, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = customertype
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    // onFilterChange (value) {
    //   dispatch(routerRedux.push({
    //     pathname: location.pathname,
    //     query: {
    //       ...value,
    //       page: 1,
    //       pageSize,
    //     },
    //   }))
    // },
    onFilterChange (value) {
      dispatch({
        type: 'customertype/query',
        payload: {
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({ type: 'customertype/switchIsChecked' })
    },
  }

  const listProps = {
    dataSource: listType,
    loading: loading.effects['customertype/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'customertype/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'customertype/changeTab',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'customertype/delete',
        payload: id,
      })
    },
  }

  const formProps = {
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `customertype/${modalType}`,
        payload: data,
      })
    },
    resetItem () {
      dispatch({
        type: 'customertype/resetItem',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: '',
        },
      })
    },
  }

  const tabProps = {
    ...listProps,
    ...formProps,
    ...filterProps,
    listSellprice,
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'customertype/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'customertype/query',
        })
      }
    },
  }

  // const tabBodies = [<Form {...formProps} />, <div><Filter {...filterProps} /> <List {...listProps} /></div>]
  // const tabPanes = header.map((item, key) => <TabPane tab={item} key={key} >{tabBodies[key]}</TabPane>)

  return (
    <div className="content-inner">
      <Form {...tabProps} />
    </div>
  )
}

CustomerType.propTypes = {
  customertype: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ customertype, loading }) => ({ customertype, loading }))(CustomerType)
