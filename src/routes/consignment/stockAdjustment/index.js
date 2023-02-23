import React from 'react'
import { connect } from 'dva'
import { Col, Modal, Table, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { numberFormat } from 'utils'
import Form from './Form'
import Filter from './Filter'
import List from './List'

const TabPane = Tabs.TabPane
const numberFormatter = numberFormat.numberFormatter
let modalDetail = false

function StockAdjustment ({ consignmentStockAdjustment, consignmentOutlet, dispatch, loading }) {
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

  if (!consignmentId) {
    return (
      <div>Consignment not linked to this store, please contact your administrator</div>
    )
  }

  const DetailInformation = () => {
    modalDetail = false
    const dataSample = currentItem.map((record) => {
      return {
        productName: (
          <div>
            {record.productName}
          </div>
        ),
        price: (
          <div>
            Normal Price:<br />
            {`Rp ${numberFormatter(record.normalPrice)}` || '-'} <br /><br />
            Grab Price: <br />
            {`Rp ${numberFormatter(record.grabPrice)}` || '-'}<br /><br />
            Grabmart Price: <br />
            {`Rp ${numberFormatter(record.grabMartPrice)}` || '-'}<br /><br />
            e-Commerce Price: <br />
            {`Rp ${numberFormatter(record.commercePrice)}` || '-'}<br /><br />
          </div>
        ),
        qty: record.quantity
      }
    })

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

    const modal = Modal.info({
      width: '600px',
      title: 'Stock Adjustment Information',
      content: (
        <Col span={24}>
          <Table pagination={false} bordered columns={columns} rowKey={(record, key) => key} dataSource={dataSample} />
        </Col>
      ),
      onCancel () {
        modalDetail = false
        dispatch({
          type: 'consignmentStockAdjustment/updateState',
          payload: {
            currentItem: []
          }
        })
      },
      onOk () {
        modalDetail = false
        dispatch({
          type: 'consignmentStockAdjustment/updateState',
          payload: {
            currentItem: []
          }
        })
      }
    })

    return modal
  }

  const formProps = {
    vendorList,
    productList,
    selectedOutlet,
    selectedVendorProductList,
    loadingSearchVendor: (loading.effects['consignmentStockAdjustment/updateState']
      || loading.effects['consignmentStockAdjustment/querySearchVendor']),
    loading: loading.effects['consignmentStockAdjustment/queryAdd'],
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
    },
    emptyVendorList () {
      dispatch({
        type: 'consignmentStockAdjustment/updateState',
        payload: {
          vendorList: []
        }
      })
    }
  }

  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['consignmentStockAdjustment/query'],
    openDetail (id) {
      modalDetail = true
      dispatch({
        type: 'consignmentStockAdjustment/queryProductById',
        payload: {
          id
        }
      })
    },
    onFilterChange ({ pagination, status, type }) {
      const { current, pageSize } = pagination
      dispatch({
        type: 'consignmentStockAdjustment/query',
        payload: {
          pagination,
          statusFilter: status,
          typeFilter: type,
          q: q || '',
          current,
          pageSize
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
      {modalDetail && currentItem && currentItem.length > 0 && <DetailInformation />}
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
  dispatch,
  loading
}) => ({ consignmentStockAdjustment, consignmentOutlet, dispatch, loading }))(StockAdjustment)
