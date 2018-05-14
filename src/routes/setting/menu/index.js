import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { arrayToTree } from 'utils'
import { Row, Col } from 'antd'
import FormInput from './Form'
import List from './List'

const column = {
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Menu = ({ menu, dispatch }) => {
  const { listMenu, currentItem, modalType, modalEdit } = menu

  const menuTree = arrayToTree(listMenu.filter(_ => _.mpid !== '-1'), 'menuId', 'mpid')

  const formProps = {
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

  const listProps = {
    menuTree,
    modalEdit,
    onSelectMenu (key, title) {
      dispatch({
        type: 'menu/updateState',
        payload: {
          modalEdit: {
            visible: true,
            key,
            title
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
            key: '',
            title: ''
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
    onEditItem (key) {
      dispatch({
        type: 'menu/show',
        payload: {
          id: key
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

  return (
    <div className="content-inner">
      <Row>
        <Col {...column}>
          <FormInput {...formProps} />
        </Col>
        <Col {...column}>
          <List {...listProps} />
        </Col>
      </Row>
    </div >
  )
}

Menu.propTypes = {
  menu: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ menu }) => ({ menu }))(Menu)
