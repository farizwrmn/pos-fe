import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import FormInput from './Form'

const Store = ({ store, shift, city, dispatch }) => {
  const { listStore, currentItem, modalType, modalEdit, selectedShift } = store
  const { listCity } = city
  const { listShift } = shift

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
    selectedShift,
    listCity,
    listStore,
    listShift,
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
      dispatch({
        type: 'store/updateState',
        payload: {
          currentItem: {},
          modalType: 'add',
          selectedShift: []
        }
      })
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

export default connect(({ store, shift, city }) => ({ store, shift, city }))(Store)
