import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import FormInput from './Form'

const Store = ({ store, shift, counter, city, dispatch }) => {
  const { listStore, currentItem, modalType, modalEdit, setting } = store
  const { listCity } = city
  const { listShift } = shift
  const { listCounter } = counter

  const listProps = {
    listStore,
    modalEdit,
    onSelectMenu (item) {
      dispatch({
        type: 'store/updateState',
        payload: {
          modalEdit: {
            visible: true,
            item
          }
        }
      })
    },
    onCancelSelect () {
      dispatch({
        type: 'store/updateState',
        payload: {
          modalEdit: {
            visible: false,
            item: {}
          }
        }
      })
    },
    onEditItem () {
      dispatch({
        type: 'store/updateState',
        payload: {
          modalType: 'edit',
          modalEdit: {
            visible: false,
            item: {}
          }
        }
      })
      dispatch({
        type: 'store/showStore',
        payload: {
          id: modalEdit.item.id
        }
      })
    }
  }

  const formProps = {
    ...listProps,
    setting,
    listCity,
    listStore,
    listShift,
    listCounter,
    item: currentItem,
    modalType,
    button: modalType === 'add' ? 'Save' : 'Update',
    onSubmit (id, data) {
      dispatch({
        type: `store/${modalType}`,
        payload: {
          id,
          data
        }
      })
    },
    onCancel () {
      dispatch({ type: 'store/refreshSetting' })
    },
    showParents () {
      dispatch({
        type: 'store/getAllStores'
      })
    },
    showCities () {
      dispatch({
        type: 'city/query'
      })
    },
    addShift (shift) {
      dispatch({
        type: 'store/addShift',
        payload: { shift }
      })
    },
    deleteShift (shift) {
      dispatch({
        type: 'store/deleteShift',
        payload: { shift }
      })
    },
    addCounter (counter) {
      dispatch({
        type: 'store/addCounter',
        payload: { counter }
      })
    },
    deleteCounter (counter) {
      dispatch({
        type: 'store/deleteCounter',
        payload: { counter }
      })
    },
    memberCodeBySystem (value) {
      dispatch({
        type: 'store/setMemberCodeBySystem',
        payload: { value }
      })
    },
    cashRegisterPeriods (checked, value) {
      dispatch({
        type: 'store/setCashRegisterPeriods',
        payload: { checked, value }
      })
    }
  }

  return (
    <div className="content-inner">
      <FormInput {...formProps} />
    </div >
  )
}

Store.propTypes = {
  store: PropTypes.object,
  city: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ store, shift, counter, city }) => ({ store, shift, counter, city }))(Store)
