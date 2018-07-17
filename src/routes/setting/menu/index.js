import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { arrayToTree } from 'utils'
import FormInput from './Form'

const Menu = ({ menu, dispatch }) => {
  const { listMenu, currentItem, modalType, modalEdit } = menu
  const menuTree = arrayToTree(listMenu.filter(_ => _.mpid !== '-1').sort((x, y) => x.menuId - y.menuId), 'menuId', 'mpid')
  const listProps = {
    modalEdit,
    onSelectMenu (item) {
      dispatch({
        type: 'menu/updateState',
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
        type: 'menu/updateState',
        payload: {
          modalEdit: {
            visible: false,
            item: {}
          }
        }
      })
    },
    onChangeTree (dragId, dragKey, dropKey) {
      dispatch({
        type: 'menu/editDraggable',
        payload: {
          id: dragId,
          data: {
            menuId: dragKey,
            bpid: dropKey,
            mpid: dropKey
          }
        }
      })
    },
    onEditItem () {
      dispatch({
        type: 'menu/updateState',
        payload: {
          currentItem: modalEdit.item,
          modalType: 'edit',
          modalEdit: {
            visible: false,
            item: {}
          }
        }
      })
    },
    onDeleteItem (key) {
      dispatch({
        type: 'menu/delete',
        payload: {
          id: key
        }
      })
    }
  }

  const formProps = {
    ...listProps,
    item: currentItem,
    menuTree,
    modalType,
    button: modalType === 'add' ? 'Save' : 'Update',
    onSubmit (id, data) {
      dispatch({
        type: `menu/${modalType}`,
        payload: {
          id,
          data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'menu/updateState',
        payload: {
          currentItem: {},
          modalType: 'add'
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <FormInput {...formProps} />
    </div >
  )
}

Menu.propTypes = {
  menu: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ menu }) => ({ menu }))(Menu)
