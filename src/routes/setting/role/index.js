import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Checkbox, Button } from 'antd'
import ModalFrom from './Modal'
import Filter from './Filter'
import List from './List'
import styles from '../../../themes/index.less'

const Role = ({ role, dispatch }) => {
  const { listRole, roles, originalMenus, originalRoles, editRole, addRole } = role

  let columns = [{
    title: 'Menu',
    dataIndex: 'name',
    key: 'name',
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

  const deleteRole = (role) => {
    dispatch({
      type: 'role/delete',
      payload: {
        id: role
      }
    })
  }

  if (typeof roles !== 'undefined' && roles.length) {
    for (let key in roles) {
      let checkVariable = roles[key].miscVariable.split(',')
      columns.push(
        {
          title: (<div><Button disabled={editRole === roles[key].miscName} onClick={() => enableEditRole(roles[key].miscName)}>Edit</Button> <Button type="danger" disabled={editRole !== roles[key].miscName} onClick={() => deleteRole(roles[key].miscName)}>Delete</Button></div>),
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
    dispatch({
      type: 'role/add',
      payload: {
        id: data.miscName,
        data: { ...data }
      }
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
    style: { clear: 'both' },
    scroll: { x: (200 * roles.length) },
    pagination: false,
    columns,
    dataSource: listRole
  }

  return (
    <div className="content-inner">
      {addRole && <ModalFrom {...modalProps} />}
      <Filter {...filterProps} />
      <List {...listProps} />
    </div >
  )
}

Role.propTypes = {
  role: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ role }) => ({ role }))(Role)
