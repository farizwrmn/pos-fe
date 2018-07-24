import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal } from 'antd'
import { ModalList } from '../../../components'


const ModalBrowse = ({ ...modalProps, customer, loading, dispatch }) => {
  const { listCustomer, searchText, pagination } = customer
  const width = '80%'
  const modalOpts = {
    onCancel () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    ...modalProps
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '30px'
    },
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode',
      width: '100px'
    }, {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName',
      width: '140px'
    }, {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01',
      width: '200px'
    }, {
      title: 'Phone',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      width: '70px'
    }
  ]

  const listProps = {
    searchText,
    placeholderText: 'Search Customer',
    columns,
    pagination,
    dataSource: listCustomer,
    loading: loading.effects['customer/query'],
    onSearch () {
      dispatch({
        type: 'customer/query',
        payload: {
          page: 1,
          q: searchText
        }
      })
    },
    onReset () {
      dispatch({
        type: 'customer/query'
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: ''
        }
      })
    },
    onClickRow (record) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false,
          dataCustomer: record
        }
      })
    },
    changeText (text) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: text
        }
      })
    },
    onChange (page) {
      dispatch({
        type: 'customer/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    }
  }

  return (
    <Modal {...modalOpts} width={width} height="80%" footer={null}>
      <ModalList {...listProps} />
    </Modal>
  )
}

ModalBrowse.propTypes = {
  customer: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customer, loading }) => ({ customer, loading }))(ModalBrowse)

