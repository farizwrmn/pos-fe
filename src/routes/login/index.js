import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Cascader, Popover } from 'antd'
import { config, ip } from 'utils'
import Footer from 'components/Layout/Footer'
import Info from 'components/Layout/Info'
import styles from './index.less'

const { authBy } = config
const FormItem = Form.Item

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll
  }
}) => {
  const { loginLoading, listUserRole, visibleItem/* , ipAddress */ } = login

  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) { return }

      const ipAddress = ip.getIpAddress() || '127.0.0.1'
      dispatch({ type: 'app/saveIPClient', payload: { ipAddr: ipAddress } })
      values.ipaddr = ipAddress
      values.userrole = values.userrole ? values.userrole.toString() : ''
      dispatch({ type: 'login/login', payload: values })
    })
  }
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.logo}>
          <img alt={'logo'} src={config.logo} />
        </div>
        <form>
          <FormItem className={styles.formItem} hasFeedback>
            {getFieldDecorator(`user${authBy}`, {
              rules: [{ required: true }]
            })(<Input size="large" placeholder="Username" />)}
          </FormItem>
          <FormItem className={styles.formItem} hasFeedback>
            {getFieldDecorator('password', {
              rules: [{ required: true }]
            })(<Input size="large"
              type="password"
              onPressEnter={handleOk} // onBlur={handleRole} onPressEnter={handleRole}
              placeholder="Password"
            />)}
          </FormItem>
          { visibleItem.verificationCode &&
          <FormItem className={styles.formItem} hasFeedback>
            {getFieldDecorator('verification', {
            })(<Input size="large"
              type="password"
              onPressEnter={handleOk}
              placeholder="Verification"
            />)}
          </FormItem>
          }
          {visibleItem.userRole &&
          <FormItem hasFeedback>
            {getFieldDecorator('userrole', {})(<Cascader
              size="large"
              style={{ width: '100%' }}
              options={listUserRole}
              placeholder={listUserRole.length > 0 ? 'Choose' : 'No Role'}
            />)}
          </FormItem>
          }
          <Row>
            <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
              Sign in
            </Button>
            <p>
              <Footer otherClass={styles.footerlogin} />
            </p>
          </Row>
        </form>
      </div>
      <Popover placement="rightBottom" content={<div><Info /></div>} >
        <Button className={styles.info} type="dashed" shape="circle" icon="info" />
      </Popover>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
