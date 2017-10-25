import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import { connect } from 'dva'
import { DropOption } from 'components'
import AdjustForm from './AdjustForm'

const FormItem = Form.Item

const ListProduct = ({ onChooseItem, purchase, dispatch, ...adjustProps }) => {
  const {searchText, filtered, tmpProductList} = purchase

  const handleMenuClick = (record) => {
    onChooseItem(record)
  }

  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'purchase/onInputChange',
      payload: {
        searchText: value,
      },
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'purchase/onProductSearch',
      payload: {
        searchText: searchText,
        tmpProductList: tmpProductList,
      },
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'purchase/onProductReset',
      payload: {
        searchText: '',
        tmpProductList: tmpProductList,
      },
    })
  }

  const modalProps = {
    ...adjustProps
  }

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '25%',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '45%',
    },
    {
      title: 'Cost Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '20%',
    }
  ]
  return (
    <AdjustForm {...modalProps}/>
  )
}

ListProduct.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  purchase: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchase }) => ({ purchase }))(ListProduct)
