import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import FormUnit from './FormUnit'

const Unit = ({
  item,
  modalType,
  customer,
  cancelUnit,
  confirmSendUnit,
  customerunit,
  customerInfo,
  dispatch
}) => {
  const { selected, listBrand, listModel, listType } = customerunit
  const { addUnit } = customer
  const formUnitProps = {
    cancelUnit,
    confirmSendUnit,
    item,
    addUnit,
    modalType,
    customerInfo,
    listBrand,
    listModel,
    listType,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `customerunit/${modalType}`,
        payload: data
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {}
        }
      })
    },
    onFocusBrand () {
      dispatch({ type: 'customerunit/queryCarBrands' })
    },
    onFocusModel () {
      if (Object.keys(selected.brand).length) {
        dispatch({ type: 'customerunit/queryCarModels', payload: { code: selected.brand.key } })
      }
    },
    onFocusType () {
      if (Object.keys(selected.model).length) {
        dispatch({ type: 'customerunit/queryCarTypes', payload: { code: selected.model.key } })
      }
    },
    onSelectBrand (brand) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand,
            model: selected.model,
            type: selected.type
          }
        }
      })
    },
    onSelectModel (model) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand: selected.brand,
            model,
            type: selected.type
          }
        }
      })
    },
    onSelectType (type) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand: selected.brand,
            model: selected.model,
            type
          }
        }
      })
    },
    onCancelUpdate () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    resetCars () {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          listBrand: [],
          listModel: [],
          listType: []
        }
      })
    }
  }

  return (
    <FormUnit {...formUnitProps} />
  )
}

export default connect(({ customerunit, customer }) => ({ customerunit, customer }))(Unit)