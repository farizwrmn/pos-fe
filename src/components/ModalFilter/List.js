import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Tag } from 'antd'
import { ModalList } from '../../routes/components'


const List = ({
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
      key: 'cashierId'
    }, {
      title: 'Cashier Name',
      dataIndex: 'cashierName',
      key: 'cashierName'
    }, {
      title: 'Cashier',
      dataIndex: 'isCashierActive',
      key: 'isCashierActive',
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

List.propTypes = {
  loading: PropTypes.object
}

export default List

