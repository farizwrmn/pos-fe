import React from 'react'
import { connect } from 'dva'
import FormField from './Form'

const CustomFields = ({ workorder, dispatch }) => {
  const { currentItem, formType, listCustomFields, modalEdit } = workorder

  const listProps = {
    list: listCustomFields,
    modalEdit,
    editField (item) {
      dispatch({ type: 'workorder/editField', payload: item })
    },
    showEditModal (item) {
      dispatch({ type: 'workorder/showEditModal', payload: item || {} })
    },
    deleteField (id) {
      dispatch({ type: 'workorder/deleteWOCustomFields', payload: { id } })
    }
  }

  const formProps = {
    listProps,
    list: listCustomFields,
    item: currentItem,
    formType,
    updateCurrentItem (sortingIndex) {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          currentItem: {
            ...currentItem,
            sortingIndex
          }
        }
      })
    },
    submitItem (data) {
      dispatch({ type: `workorder/${formType}WOCustomFields`, payload: data })
    },
    cancelEdit () {
      dispatch({
        type: 'workorder/updateState',
        payload: {
          currentItem: {},
          formType: 'add'
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <FormField {...formProps} />
    </div>
  )
}

export default connect(({ workorder }) => ({ workorder }))(CustomFields)
