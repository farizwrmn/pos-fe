import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import moment from 'moment'
import get from 'lodash/get'
import { lstorage } from 'utils'
import Form from './Form'
import ListTransfer from './ListTransferOut'
import FilterTransfer from './FilterTransferOut'

const { getCashierTrans } = lstorage
const TabPane = Tabs.TabPane

const Transfer = ({ location, importTransferOut, stockLocation, transferOut, productcategory, productbrand, pos, employee, app, dispatch, loading }) => {
  const { modalImportProductVisible, listReason, listTransferOut, listProductDemand, selectedRowKeys, modalProductDemandVisible, modalInvoiceVisible, listInvoice, tmpInvoiceList, isChecked, listProducts, listTransOut, period, listTrans, listItem, listStore, currentItem, currentItemPrint, currentItemList, modalVisible, modalConfirmVisible, formType, display, activeKey, pagination, disable, filter, sort, showPrintModal } = transferOut
  const { listImported } = importTransferOut
  const { query } = location
  const { list: listStockLocation } = stockLocation
  const { modalProductVisible, listProductData, searchText } = pos
  const { list } = employee
  let listEmployee = list
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const { user, storeInfo, setting } = app
  const filterProps = {
    display,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'transferOut/query',
        payload: {
          userName: value.cityName,
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'transferOut/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    }
  }

  function getQueueQuantity () {
    const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
    // const listQueue = get(queue, `queue${curQueue}`) ? get(queue, `queue${curQueue}`) : []
    let tempQueue = []
    let tempTrans = []
    for (let n = 0; n < 10; n += 1) {
      tempQueue = get(queue, `queue${n}`) ? get(queue, `queue${n}`) : []
      if (tempQueue.length > 0) {
        tempTrans = tempTrans.concat(tempQueue[0].cashier_trans)
      }
    }
    if (tempTrans.length > 0) {
      return tempTrans
    }
    console.log('queue is empty, nothing to check')
    return []
  }

  const checkQuantityNewProduct = (e) => {
    const { data } = e
    const tempQueue = getQueueQuantity()
    const tempCashier = getCashierTrans()
    const Cashier = tempCashier.filter(el => el.productId === data.productId)
    const Queue = tempQueue.filter(el => el.productId === data.productId)
    // const item = listItem.filter(el => el.productId === data.productId)
    let arrData = []
    arrData.push({ ...data })
    const totalData = arrData.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const totalLocal = (Queue.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)) + Cashier.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const Quantity = (arrData.concat(Queue)).concat(Cashier)
    const totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    const listProduct = listProductData
    const tempListProduct = listProduct.filter(el => el.productId === data.productId)
    const totalListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
    function getSetting (setting) {
      let json = setting.Inventory
      let jsondata = JSON.stringify(eval(`(${json})`))
      const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
      return outOfStock
    }
    const outOfStock = getSetting(setting)
    if (totalQty > totalListProduct && outOfStock === 0) {
      Modal.warning({
        title: 'No available stock',
        content: `Your input: ${totalData}, Local : ${totalLocal} Available: ${totalListProduct}`
      })
      return false
    }
    return true
  }

  const handleItemEdit = (item, event) => {
    dispatch({
      type: 'transferOut/updateQty',
      payload: {
        listItem,
        item,
        form: event ? event.target.form : null,
        events: {
          ...event
        }
      }
    })
    // if (event && event.target && event.target.form) {
    //   const form = event.target.form
    //   const index = [...form].indexOf(event.target)
    //   if (form.elements[index + 1]) {
    //     form.elements[index + 1].focus()
    //     event.preventDefault()
    //   }
    // }
  }

  const listProps = {
    dataSource: listItem,
    loading: loading.effects['transferOut/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'transferOut/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'transferOut/changeTab',
        payload: {
          formType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'transferOut/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'transferOut/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'transferOut/changeTab',
        payload: {
          activeKey: key,
          formType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      if (key === '1') {
        dispatch({
          type: 'transferOut/query'
        })
      }
    }
  }

  const modalImportProductProps = {
    visible: modalImportProductVisible,
    dataSource: listImported,
    loading,
    width: 1000,
    onOk (from, to) {
      let arrayProd = []
      for (let key in listImported) {
        const item = listImported[key]
        if (Number(item.sortIndex) >= from && Number(item.sortIndex) <= to) {
          const data = {
            no: arrayProd.length + 1,
            brandName: item.brandName,
            categoryName: item.categoryName,
            productImage: item.productImage,
            productCode: item.productCode,
            dimension: item.dimension,
            dimensionBox: item.dimensionBox,
            dimensionPack: item.dimensionPack,
            productId: item.productId,
            transType: 'MUOUT',
            productName: item.productName,
            qty: item.qty,
            qtyDemand: undefined,
            qtyStore: undefined,
            stock: item.stock || 0,
            description: null
          }
          if (item.qty > 0) {
            arrayProd.push(data)
          }
        }
      }

      dispatch({
        type: 'transferOut/updateState',
        payload: {
          listItem: arrayProd,
          modalImportProductVisible: false
        }
      })
      dispatch({
        type: 'importTransferOut/updateState',
        payload: {
          listImported: []
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalImportProductVisible: false
        }
      })
      dispatch({
        type: 'importTransferOut/updateState',
        payload: {
          listImported: []
        }
      })
    }
  }

  const modalProductDemandProps = {
    listProductDemand,
    listCategory,
    listStockLocation,
    listBrand,
    width: 1000,
    loading,
    selectedRowKeys,
    visible: modalProductDemandVisible,
    maskClosable: false,
    title: 'Transfer demand',
    confirmLoading: loading.effects['transferOut/submitProductDemand'],
    wrapClassName: 'vertical-center-modal',
    onOk () {
      dispatch({
        type: 'transferOut/submitProductDemand',
        payload: {
          listProductDemand,
          selectedRowKeys
        }
      })
    },
    handleItemEdit (item, event) {
      dispatch({
        type: 'transferOut/editDemandDetail',
        payload: {
          listProductDemand,
          item,
          form: event ? event.target.form : null,
          events: {
            ...event
          }
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferOut/hideModalDemand',
        payload: {
          modalProductDemandVisible: false,
          selectedRowKeys: []
        }
      })
    },
    handleGetAll (storeId) {
      console.log('handleGetAll')
      dispatch({
        type: 'transferOut/showModalDemand',
        payload: {
          type: 'all',
          modalProductDemandVisible: true,
          storeId
        }
      })
    },
    updateSelectedKey (key) {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          selectedRowKeys: key
        }
      })
    }
  }

  const modalProductProps = {
    location,
    loading,
    pos,
    listInvoice,
    tmpInvoiceList,
    searchText,
    modalProductVisible,
    visible: modalProductVisible || modalInvoiceVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      dispatch({
        type: 'pos/getProducts',
        payload: {
          q: searchText === '' ? null : searchText,
          active: 1,
          page: Number(e.current),
          pageSize: Number(e.pageSize)
        }
      })
    },
    showProductQty (data) {
      dispatch({
        type: 'pos/showProductQty',
        payload: {
          data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pos/hideProductModal'
      })
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalInvoiceVisible: false
        }
      })
    },
    handleProductDemandBrowse (storeId) {
      dispatch({
        type: 'transferOut/showModalDemand',
        payload: {
          modalProductDemandVisible: true,
          storeId
        }
      })
    },
    handleProductBrowse () {
      dispatch({
        type: 'pos/getProducts',
        payload: {
          active: 1
        }
      })
      console.log('call this')
      // dispatch({
      //   type: 'pos/getListProductData'
      // })
      dispatch({
        type: 'pos/showProductModal',
        payload: {
          modalType: 'browseProductFree'
        }
      })
    },
    handleImportedBrowse () {
      dispatch({
        type: 'importTransferOut/queryTransferOut'
      })

      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalImportProductVisible: true
        }
      })
    },
    handleInvoiceBrowse () {
      dispatch({
        type: 'transferOut/getInvoice'
      })
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalType: 'modalInvoice'
        }
      })
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalInvoiceVisible: true
        }
      })
    },
    onChooseItem (item) {
      let arrayProd = []
      const listByCode = listItem
      const checkExists = listByCode.filter(el => el.productCode === item.productCode)
      if (checkExists.length === 0) {
        arrayProd = listByCode
        const data = {
          no: arrayProd.length + 1,
          brandName: item.brandName,
          categoryName: item.categoryName,
          productImage: item.productImage,
          productCode: item.productCode,
          dimension: item.dimension,
          dimensionBox: item.dimensionBox,
          dimensionPack: item.dimensionPack,
          productId: item.id,
          transType: 'MUOUT',
          productName: item.productName,
          qty: 1,
          qtyDemand: undefined,
          qtyStore: undefined,
          stock: item.count || 0,
          description: null
        }
        const check = {
          data
        }
        const checkQuantity = checkQuantityNewProduct(check)
        if (!checkQuantity) {
          return
        }
        arrayProd.push({ ...data })

        dispatch({
          type: 'transferOut/updateState',
          payload: {
            listItem: arrayProd,
            currentItemList: data,
            modalVisible: true
          }
        })
        dispatch({
          type: 'pos/updateState',
          payload: {
            modalProductVisible: false
          }
        })
      } else {
        Modal.warning({
          title: 'Cannot add product',
          content: 'Already Exists in list'
        })
      }
    },
    onInvoiceHeader (period) {
      dispatch({
        type: 'transferOut/getInvoice',
        payload: {
          ...period
        }
      })
    },
    onChooseInvoice (item) {
      console.log('onChooseInvoice')
      dispatch({
        type: 'transferOut/getInvoiceDetailPurchase',
        payload: item
      })
    }
  }

  const formEditProps = {
    visible: modalVisible,
    listReason,
    currentItemList,
    modalProductProps,
    onOkList (item) {
      handleItemEdit(item)
    },
    onCancelList () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false
        }
      })
    },
    onDeleteItem (no) {
      dispatch({
        type: 'transferOut/deleteListState',
        payload: {
          no,
          listItem
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false
        }
      })
    }
  }
  const formConfirmProps = {
    visible: modalConfirmVisible,
    modalConfirmVisible,
    itemPrint: currentItemPrint,
    user,
    storeInfo,
    onShowModal () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalConfirmVisible: true
        }
      })
    },
    onOkPrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
      // const check = {
      //   data: item
      // }
      // // checkQuantityBeforeEdit
      // dispatch({
      //   type: 'pos/queryProducts',
      //   payload: {
      //     outOfStock: 0
      //   }
      // })
      // const checkQuantity = checkQuantityNewProduct(check)
      // if (!checkQuantity) {
      //   return
      // } else {
      //   listItem[item.no - 1] = item
      // }
      // dispatch({
      //   type: 'transferOut/updateState',
      //   payload: {
      //     currentItemList: {},
      //     modalVisible: false,
      //     listItem: listItem
      //   }
      // })
    },
    onCancel () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          modalConfirmVisible: false
        }
      })
    }
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    ...formEditProps,
    ...formConfirmProps,
    formEditProps,
    dispatch,
    listTrans,
    listItem,
    listStore,
    listEmployee,
    item: currentItem,
    modalImportProductProps,
    modalProductDemandProps,
    modalProductProps,
    modalProductVisible,
    modalInvoiceVisible,
    modalVisible,
    loadingButton: loading,
    loading: loading.effects['transferOut/querySequence'],
    disabled: `${formType === 'edit' ? disable : ''}`,
    button: `${formType === 'add' ? 'Add' : 'Update'}`,
    handleItemEdit,
    onSubmit (data, list, reset) {
      Modal.confirm({
        title: 'Create Transfer',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: `transferOut/${formType}`,
            payload: {
              storeId: data.storeId,
              data,
              detail: list,
              reset
            }
          })
        },
        onCancel () {

        }
      })
    },
    resetListItem () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          listItem: []
        }
      })
    },
    getEmployee () {
      dispatch({
        type: 'employee/query',
        payload: {}
      })
    },
    hideEmployee () {
      dispatch({
        type: 'employee/updateState',
        payload: {
          listEmployee: {}
        }
      })
    },
    onModalVisible (record) {
      dispatch({
        type: 'pos/queryProducts',
        payload: {
          active: 1
        }
      })
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: record,
          modalVisible: true
        }
      })
    },
    resetItem () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          formType: 'add',
          currentItem: {},
          currentItemList: {}
        }
      })
    }
  }

  const listTransferProps = {
    dataSource: listTransferOut,
    listTransferOut,
    listProducts,
    pagination,
    listTransOut,
    itemPrint: currentItemPrint,
    loading: loading.effects['transferOut/queryTransferOut'] || loading.effects['transferOut/queryProducts'] || loading.effects['transferOut/queryByTrans'],
    location,
    deliveryOrderNo: query.deliveryOrderNo,
    filter,
    sort,
    storeInfo,
    showPrintModal,
    user,
    updateFilter (page, filters, sorts) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          filter: filters,
          sort: sorts,
          pagination: {
            payload: {
              current: Number(page.current) || 1,
              pageSize: Number(page.pageSize) || 10,
              total: listTransferOut.length
            }
          }
        }
      })
    },
    getTrans (transNo, storeId) {
      dispatch({
        type: 'transferOut/queryByTrans',
        payload: {
          transNo,
          storeId
        }
      })
    },
    onShowPrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          showPrintModal: true
        }
      })
    },
    onClosePrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          showPrintModal: false
        }
      })
    }
  }

  const filterTransferProps = {
    period,
    filter: {
      ...location.query
    },
    filterChange (date) {
      const { query, pathname } = location
      dispatch({
        type: 'transferOut/queryTransferOut',
        payload: {
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
        }
      })
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
          page: 1,
          pageSize: 10
        }
      }))
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          period: date
        }
      })
    },
    filterTransNo (date, no) {
      dispatch({
        type: 'transferOut/queryTransferOut',
        payload: {
          transNo: no
        }
      })
    }
  }

  const changeTab = (key) => {
    const { query, pathname } = location
    if (key === '1') {
      dispatch({
        type: 'transferOut/queryTransferOut',
        payload: {
          start: moment().startOf('month').format('YYYY-MM-DD'),
          end: moment().endOf('month').format('YYYY-MM-DD')
        }
      })
    }
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        page: 1,
        pageSize: 10,
        activeKey: key
      }
    }))
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} type="card" onChange={key => changeTab(key)}>
        <TabPane tab="Add" key="0">
          <Form {...formProps} />
        </TabPane>
        <TabPane tab="Archieve" key="1">
          <FilterTransfer {...filterTransferProps} />
          <ListTransfer {...listTransferProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Transfer.propTypes = {
  stockLocation: PropTypes.object,
  transferOut: PropTypes.object,
  pos: PropTypes.object,
  app: PropTypes.object,
  productcategory: PropTypes.object,
  productbrand: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ stockLocation, importTransferOut, transferOut, pos, productcategory, productbrand, employee, app, loading }) => ({ stockLocation, importTransferOut, transferOut, pos, productcategory, productbrand, employee, app, loading }))(Transfer)
