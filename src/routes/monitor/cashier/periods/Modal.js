import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Tag } from 'antd'
import { ModalList } from '../../../components'


const ModalBrowse = ({
  ...modalProps,
  listCashier,
  searchText,
  pagination,
  loading,
  onSearch,
  onReset,
  onClickRow,
  changeText,
  onChange
}) => {
  const width = '80%'
  const modalOpts = {
    ...modalProps
  }

  const columns = [
    {
      title: 'Cashier ID',
      dataIndex: 'cashierId',
      key: 'cashierId',
      width: '100px'
    }, {
      title: 'Cashier Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: '140px'
    }, {
      title: 'Cashier',
      dataIndex: 'isCashierActive',
      key: 'isCashierActive',
      width: '200px',
      render: text =>
        (<span>
          <Tag color={text ? 'blue' : 'red'}>
            {text ? 'Active' : 'Non-Active'}
          </Tag>
        </span>)
    }, {
      title: 'Employee',
      dataIndex: 'isEmployeeActive',
      key: 'isEmployeeActive',
      width: '70px',
      render: text =>
        (<span>
          <Tag color={text ? 'blue' : 'red'}>
            {text ? 'Active' : 'Non-Active'}
          </Tag>
        </span>)
    }
  ]

  const listProps = {
    searchText,
    placeholderText: 'Search Cashier',
    columns,
    pagination,
    dataSource: listCashier,
    loading: loading.effects['cashier/query'],
    onSearch,
    onReset,
    onClickRow,
    changeText,
    onChange
  }

  return (
    <Modal {...modalOpts} width={width} height="80%" footer={[]}>
      <ModalList {...listProps} />
    </Modal>
  )
}

ModalBrowse.propTypes = {
  loading: PropTypes.object
}

export default ModalBrowse

