import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { ModalList } from '../../../components'


const ModalBrowse = ({
  ...modalProps,
  listCustomer,
  searchText,
  pagination,
  loading,
  onSearch,
  onReset,
  onClickRow,
  changeText,
  onChange
}) => {
  const modalOpts = {
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
    onSearch,
    onReset,
    onClickRow,
    changeText,
    onChange
  }

  return (
    <Modal className="modal-browse" {...modalOpts} footer={[]}>
      <ModalList {...listProps} />
    </Modal>
  )
}

ModalBrowse.propTypes = {
  loading: PropTypes.object
}

export default ModalBrowse

