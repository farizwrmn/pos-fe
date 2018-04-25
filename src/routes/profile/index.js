import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="Change Password" key="1"><Password {...passwordProps} /></TabPane>
          <TabPane tab="TOTP" key="2"><TOTP {...totpProps} /></TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default connect(({ app }) => ({ app }))(Profile)
