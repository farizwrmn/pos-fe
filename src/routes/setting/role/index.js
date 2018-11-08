import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Checkbox, Button, Modal } from 'antd'
import ModalFrom from './Modal'
import Permission from './Permission'
import Filter from './Filter'
import List from './List'
import styles from '../../../themes/index.less'

const Role = ({ role, loading, permission, dispatch }) => {
  const { listRole, modalPermissionVisible, roles, originalMenus, originalRoles, editRole, addRole } = role
  const { listPermission, currentItem, roleId } = permission

  let columns = [{
    title: 'Menu',
    dataIndex: 'name',
    key: 'name',
    width: window.screen.width < 400 ? 170 : 250,
    fixed: 'left'
  }]

  const changeRole = (e) => {
    const { name, value } = e.target.value
    dispatch({
      type: 'role/modifyRole',
      payload: {
        item: { name, value, checked: e.target.checked },
        editRole,
        roles,
        originalMenus
      }
    })
  }

  const enableEditRole = (role) => {
    dispatch({
      type: 'role/updateState',
      payload: {
        editRole: role,
        originalRoles: roles
      }
    })
  }

  const onEditPermission = (value) => {
    dispatch({
      type: 'permission/query',
      payload: {
        type: 'all'
      }
    })
    dispatch({
      type: 'permission/queryCurrentPermission',
      payload: {
        type: 'all',
        role: value
      }
    })
    dispatch({
      type: 'role/updateState',
      payload: {
        modalPermissionVisible: true
      }
    })
  }

  const onClosePermission = () => {
    dispatch({
      type: 'permission/updateState',
      payload: {
        currentItem: [],
        roleId: null
      }
    })
    dispatch({
      type: 'role/updateState',
      payload: {
        modalPermissionVisible: false
      }
    })
  }

  const deleteRole = (role) => {
    Modal.confirm({
      title: `Do you Want to delete ${role.miscDesc}'s role?`,
      onOk () {
        dispatch({
          type: 'role/delete',
          payload: {
            id: role.miscName
          }
        })
      },
      onCancel () { }
    })
  }

  if (typeof roles !== 'undefined' && roles.length) {
    for (let key in roles) {
      let checkVariable = roles[key].miscVariable.split(',')
      columns.push(
        {
          title: (<div>
            <Button disabled={editRole === roles[key].miscName} onClick={() => enableEditRole(roles[key].miscName)}>Edit</Button>
            <Button type="danger" disabled={editRole !== roles[key].miscName} onClick={() => deleteRole(roles[key])}>Delete</Button>
            <Button type="primary" disabled={editRole === roles[key].miscName} onClick={() => onEditPermission(roles[key].miscName)}>Permission</Button>
          </div>),
          // title: (<div><Button disabled={editRole === roles[key].miscName} onClick={() => enableEditRole(roles[key].miscName)}>Edit</Button> <Button type="danger" disabled onClick={() => deleteRole(roles[key])}>Delete</Button></div>),
          children: [
            {
              title: roles[key].miscDesc,
              dataIndex: roles[key].miscDesc,
              key: roles[key].miscDesc,
              className: styles.alignCenter,
              render: x => (<Checkbox disabled={editRole !== roles[key].miscName} checked={checkVariable.indexOf(x) > -1} value={{ name: roles[key].miscDesc, value: x }} onChange={changeRole} />)
            }
          ]
        }
      )
    }
  }

  const saveNewRole = (data) => {
    Modal.confirm({
      title: `Do you Want to save ${data.miscDesc}'s role?`,
      onOk () {
        dispatch({
          type: 'role/add',
          payload: {
            id: data.miscName,
            data: { ...data }
          }
        })
      },
      onCancel () { }
    })
  }

  const cancelSave = () => {
    dispatch({
      type: 'role/updateState',
      payload: {
        addRole: false
      }
    })
  }

  const modalProps = {
    roles,
    saveNewRole,
    cancelSave,
    visible: addRole,
    title: 'Add new Role',
    onCancel () {
      cancelSave()
    }
  }

  const filterProps = {
    editRole,
    onAddRole () {
      dispatch({
        type: 'role/updateState',
        payload: {
          addRole: true
        }
      })
    },
    saveRole () {
      let role = roles.find(x => x.miscName === editRole)
      dispatch({
        type: 'role/updateRole',
        payload: {
          id: editRole,
          data: {
            miscVariable: role.miscVariable
          }
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'role/updateState',
        payload: {
          editRole: '',
          roles: originalRoles
        }
      })
    }
  }

  const listProps = {
    scroll: { x: (200 * roles.length) },
    pagination: false,
    columns,
    dataSource: listRole
  }

  const permissionProps = {
    item: currentItem,
    roleId,
    loading,
    listPermission: listPermission || [],
    visible: modalPermissionVisible,
    onOk (data) {
      dispatch({
        type: 'permission/edit',
        payload: {
          data
        }
      })
    },
    cancelSave () {
      onClosePermission()
    },
    onCancel () {
      onClosePermission()
    }
  }

  return (
    <div className="content-inner">
      {addRole && <ModalFrom {...modalProps} />}
      {modalPermissionVisible && <Permission {...permissionProps} />}
      <Filter {...filterProps} />
      <List {...listProps} />
    </div >
  )
}

Role.propTypes = {
  role: PropTypes.object,
  loading: PropTypes.object.isRequired,
  permission: PropTypes.object.isRequired,
  dispatch: PropTypes.func
}

export default connect(({ role, permission, loading }) => ({ role, permission, loading }))(Role)
