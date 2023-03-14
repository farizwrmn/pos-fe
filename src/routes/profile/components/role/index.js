import { Cascader, Tooltip } from 'antd'
import { lstorage } from 'utils'
import React from 'react'


const Role = ({
  changeRole
}) => {
  const defaultRole = lstorage.getCurrentUserRole()
  const listUserRoles = lstorage.getListUserRoles()

  const handleChangeRole = (value) => {
    const localId = lstorage.getStorageKey('udi')
    const dataUdi = [
      localId[1],
      value.toString(),
      localId[3],
      localId[4],
      localId[5],
      localId[6],
      localId[7]
    ]
    lstorage.putStorageKey('udi', dataUdi, localId[0])
    changeRole(value.toString())
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ alignSelf: 'center' }}>
        <Tooltip placement="top" title="click to switch role">
          <Cascader options={listUserRoles}
            onChange={handleChangeRole}
            changeOnSelect
            allowClear={false}
            defaultValue={[defaultRole]}
            placeholder="Switch Role"
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default Role
