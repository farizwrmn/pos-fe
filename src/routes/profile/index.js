import React from 'react'
import { connect } from 'dva'
import { Cascader, Tabs, Tooltip } from 'antd'
import { lstorage } from 'utils'
import { User, Password, TOTP } from './components'
import styles from './index.less'

const TabPane = Tabs.TabPane

const Profile = ({ app, dispatch }) => {
  const { user, visiblePw, totp, totpChecked } = app

  const userProps = {
    user
  }

  const passwordProps = {
    visiblePw,
    onTogglePw () {
      dispatch({ type: 'app/togglePw' })
    },
    onUpdatePw (data) {
      dispatch({
        type: 'app/changePw',
        payload: {
          id: user.userid,
          data,
          currentItem: {}
        }
      })
    }
  }

  const defaultRole = lstorage.getCurrentUserRole()
  const listUserRoles = lstorage.getListUserRoles()

  const changeRole = (roleCode) => {
    dispatch({ type: 'app/query', payload: { userid: user.userid, role: roleCode } })
    // dispatch({ type: 'app/setPermission', payload: { role: roleCode } })
    setTimeout(() => { window.location.reload() }, 200)
  }

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

  const totpProps = {
    user,
    totp,
    totpChecked,
    onGenerateTotp () {
      dispatch({
        type: 'app/totp',
        payload: { mode: 'generate', id: user.userid }
      })
    },
    onUpdateTotp (userId, data) {
      dispatch({
        type: 'app/totp',
        payload: { mode: 'edit', id: userId, data }
      })
    },
    onSwitchTotp (checked, userId) {
      if (checked) {
        dispatch({
          type: 'app/totp',
          payload: { mode: 'generate', id: userId }
        })
        dispatch({
          type: 'app/updateState',
          payload: { totpChecked: true }
        })
      } else {
        dispatch({
          type: 'app/updateState',
          payload: { totpChecked: false }
        })
      }
    }
  }

  return (
    <div className="content-inner">
      <div className={styles.profile}>
        <User {...userProps} />
        <div>
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="Change Password" key="1"><Password {...passwordProps} /></TabPane>
          <TabPane tab="TOTP" key="2"><TOTP {...totpProps} /></TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default connect(({ app }) => ({ app }))(Profile)
