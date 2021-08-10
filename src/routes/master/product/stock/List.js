import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Icon } from 'antd'
import { routerRedux } from 'dva/router'
import { DropOption } from 'components'
import moment from 'moment'
import { IMAGEURL } from 'utils/config.company'
import { lstorage } from 'utils'
import { getDistPriceName } from 'utils/string'
import styles from '../../../../themes/index.less'

const confirm = Modal.confirm

const List = ({ ...tableProps,
  user,
  dispatch,
  loadingModel,
  editItem,
  deleteItem,
  listCategory,
  listBrand
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } if (e.key === '2') {
      dispatch(routerRedux.push('/transaction/purchase/add'))
    } if (e.key === '3') {
      dispatch(routerRedux.push('/report/fifo/card'))
    } else if (e.key === '4') {
      confirm({
        title: `Are you sure delete ${record.productName} ?`,
        onOk () {
          deleteItem(record.productCode)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: '80px',
      render: (text) => {
        return <Tag color={text ? 'blue' : 'red'}>{text ? 'Active' : 'Non-Active'}</Tag>
      }
    },
    {
      title: 'Image',
      dataIndex: 'productImage',
      key: 'productImage',
      width: '100px',
      render: (text) => {
        if (text
          && text != null
          && text !== '"no_image.png"'
          && text !== 'no_image.png') {
          const item = JSON.parse(text)
          if (item && item[0]) {
            return <img height="70px" src={`${IMAGEURL}/${item[0]}`} alt="no_image" />
          }
        }
        return null
      }
    },
    {
      title: 'Qty',
      dataIndex: 'count',
      key: 'count',
      width: '50px',
      className: styles.clickableRight,
      onCellClick: (record) => {
        dispatch({
          type: 'updateState',
          payload: {
            countStoreList: []
          }
        })
        dispatch({
          type: 'productstock/showProductStoreQty',
          payload: {
            data: [record]
          }
        })
      },
      render: (text) => {
        if (!loadingModel.effects['productstock/showProductQty']) {
          return text || 0
        }
        return <Icon type="loading" />
      }
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.productCode}</strong></div>
            <div>{record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierId',
      key: 'supplierId',
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.supplierCode}</strong></div>
            <div>{record.supplierName}</div>
          </div>
        )
      }
    },

    {
      title: 'Brand',
      dataIndex: 'brandId',
      key: 'brandId',
      filters: listBrand ? listBrand.map(item => ({ text: item.brandName, value: item.id })) : [],
      render: (text, record) => record.brandName
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      filters: listCategory ? listCategory.map(item => ({ text: item.categoryName, value: item.id })) : [],
      render: (text, record) => record.categoryName
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      className: styles.alignRight,
      width: '150px',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      className: styles.alignRight,
      width: '70px',
      render: (text, record) => {
        return `${Math.round(((parseFloat(record.sellPrice) - parseFloat(record.costPrice)) / parseFloat(record.sellPrice)) * 100)} %`
      }
    },
    {
      title: getDistPriceName('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].sellPrice
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice01'),
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice01
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice02'),
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice02
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice03'),
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice03
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice04'),
      dataIndex: 'distPrice04',
      key: 'distPrice04',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice04
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    {
      title: getDistPriceName('distPrice05'),
      dataIndex: 'distPrice05',
      key: 'distPrice05',
      className: styles.alignRight,
      render: (text, record) => {
        let currentPrice = text
        if (record && record.storePrice && record.storePrice[0]) {
          const price = record.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
          if (price && price[0]) {
            currentPrice = price[0].distPrice05
          }
        }
        return (currentPrice || '-').toLocaleString()
      }
    },
    // {
    //   title: 'Track Qty',
    //   dataIndex: 'trackQty',
    //   key: 'trackQty',
    //   render: (text) => {
    //     return <Tag color={text ? 'blue' : 'red'}>{text ? 'True' : 'False'}</Tag>
    //   }
    // },
    // {
    //   title: 'Alert Qty',
    //   dataIndex: 'alertQty',
    //   key: 'alertQty',
    //   className: styles.alignRight,
    //   render: text => (text || '-').toLocaleString()
    // },
    // {
    //   title: 'Created',
    //   children: [
    //     {
    //       title: 'By',
    //       dataIndex: 'createdBy',
    //       key: 'createdBy'
    //     },
    //     {
    //       title: 'Time',
    //       dataIndex: 'createdAt',
    //       key: 'createdAt',
    //       render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
    //     }
    //   ]
    // },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
      // children: [
      //   {
      //     title: 'By',
      //     dataIndex: 'updatedBy',
      //     key: 'updatedBy'
      //   },
      //   {
      //     title: 'Time',
      //     dataIndex: 'updatedAt',
      //     key: 'updatedAt',
      //     render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
      //   }
      // ]
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Purchase' },
              { key: '3', name: 'History' },
              { key: '4', name: 'Delete' }
            ]}
          />
        )
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={(user.permissions.role === 'SPR' || user.permissions.role === 'OWN')
          ? columns
          : columns.filter(filtered => filtered.key !== 'costPrice' && filtered.key !== 'supplierId' && filtered.key !== 'margin')}
        simple
        scroll={{ x: 2000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
