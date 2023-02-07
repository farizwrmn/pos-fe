import React from 'react'
import { connect } from 'dva'
import { Modal, Table, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { numberFormat } from 'utils'
import Form from './Form'
import Filter from './Filter'
import List from './List'

const TabPane = Tabs.TabPane
const numberFormatter = numberFormat.numberFormatter

function StockAdjustment ({ consignmentStockAdjustment, consignmentOutlet, dispatch }) {
  const {
    activeKey,
    vendorList,
    selectedVendor,

    productList,
    selectedVendorProductList,
    currentItem,
    list,

    consignmentId,
    q,
    typeFilter,
    statusFilter,
    pagination
  } = consignmentStockAdjustment
  const { selectedOutlet } = consignmentOutlet

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentStockAdjustment/updateState',
      payload: {
        activeKey: key
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
  }

  const detailInformation = () => {
    const dataSample = currentItem.map((record) => {
      return {
        productName: (
          <div>
            {record.productName}
          </div>
        ),
        price: (
          <div>
            normalPrice:<br />
            {`Rp ${numberFormatter(record.normalPrice)}` || '-'} <br /><br />
            grab price: <br />
            {`Rp ${numberFormatter(record.grabPrice)}` || '-'}<br /><br />
            grab mart price: <br />
            {`Rp ${numberFormatter(record.grabMartPrice)}` || '-'}<br /><br />
            e-Commerce price: <br />
            {`Rp ${numberFormatter(record.commercePrice)}` || '-'}<br /><br />
          </div>
        ),
        qty: record.quantity
      }
    })

    if (!consignmentId) {
      return (
        <div>Consignment not linked to this store, please contact your administrator</div>
      )
    }

    const columns = [
      {
        title: 'Nama Produk',
        dataIndex: 'productName',
        key: 'productName'
      }, {
        title: 'Harga',
        dataIndex: 'price',
        key: 'price',
        width: '140px'
      }, {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        width: '45px'
      }
    ]

    Modal.info({
      width: '600px',
      title: 'Stock Adjustment Information',
      content: (
        <Table pagination={false} bordered columns={columns} rowKey={(record, key) => key} dataSource={dataSample} />
      ),
      onCancel () {
        dispatch({
          type: 'consignmentStockAdjustment/updateState',
          payload: {
            currentItem: []
          }
        })
      },
      onOk () {
        dispatch({
          type: 'consignmentStockAdjustment/updateState',
          payload: {
            currentItem: []
          }
        })
      }
    })
  }

  if (currentItem && currentItem.length > 0) {
    detailInformation()
  }

  const formProps = {
    vendorList,
    productList,
    selectedOutlet,
    selectedVendorProductList,
    updateProductList (list) {
      dispatch({
        type: 'consignmentStockAdjustment/updateState',
        payload: {
          productList: list
        }
      })
    },
    searchVendor (query) {
      dispatch({
        type: 'consignmentStockAdjustment/querySearchVendor',
        payload: {
          q: query
        }
      })
    },
    selectVendor (vendorId) {
      const selectedVendor = vendorList.filter(filtered => filtered.id === parseInt(vendorId, 10))[0]
      dispatch({
        type: 'consignmentStockAdjustment/queryByVendorId',
        payload: {
          selectedVendor
        }
      })
    },
    submitAdjustment (data) {
      const dataHeader = {
        outletId: consignmentId,
        vendorId: selectedVendor.id,
        handledById: null,
        requestType: data.type,
        note: data.note,
        internalNote: null,
        status: 'pending'
      }

      const dataDetail = productList

      const body = {
        dataHeader,
        dataDetail
      }

      dispatch({
        type: 'consignmentStockAdjustment/queryAdd',
        payload: body
      })
    }
  }

  const listProps = {
    pagination,
    dataSource: list,
    openDetail (id) {
      dispatch({
        type: 'consignmentStockAdjustment/queryProductById',
        payload: {
          id
        }
      })
    },
    onFilterChange ({ pagination, status, type }) {
      dispatch({
        type: 'consignmentStockAdjustment/query',
        payload: {
          pagination,
          statusFilter: status,
          typeFilter: type,
          q: q || ''
        }
      })
    }
  }

  const filterProps = {
    q,
    onFilterChange (value) {
      dispatch({
        type: 'consignmentStockAdjustment/query',
        payload: {
          q: value,
          typeFilter,
          statusFilter
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' &&
            <Form {...formProps} />
          }
        </TabPane>
        <TabPane tab="List" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentStockAdjustment,
  consignmentOutlet,
  dispatch
}) => ({ consignmentStockAdjustment, consignmentOutlet, dispatch }))(StockAdjustment)
