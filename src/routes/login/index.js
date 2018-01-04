import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Cascader, message } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import './index.less'
import Footer from 'components/Layout/Footer'
import { crypt } from 'utils'

const { authBy } = config
const FormItem = Form.Item

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const { loginLoading, listUserRole, visibleItem } = login

  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (!values.userrole) {
        message.error('Choose a valid role');
        return
      }
      if (errors) { return }

      values.userrole = values.userrole.toString()
      dispatch({ type: 'login/login', payload: values })
    })
  }
  const handleRole = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/totp', payload: values })
      // dispatch({ type: 'login/role', payload: values })
    })
  }

  return (
  <div className={styles.container}>
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem className={styles.formItem} hasFeedback>
          {getFieldDecorator('user' + authBy, {
            rules: [{ required: true }]
          })(<Input size="large" placeholder="Username" />)}
        </FormItem>
        <FormItem className={styles.formItem} hasFeedback>
          {getFieldDecorator('password', {
            rules: [{ required: true }]
          })(<Input size="large" type="password" onBlur={handleRole} onPressEnter={handleRole}
                    placeholder="Password" />)}
        </FormItem>
        { visibleItem.verificationCode &&
          <FormItem className={styles.formItem} hasFeedback>
            {getFieldDecorator('verification', {
            })(<Input size="large" type="password" onBlur={handleRole} onPressEnter={handleRole}
                      placeholder="Verification" />)}
          </FormItem>
        }
        {visibleItem.userRole &&
          <FormItem hasFeedback>
            {getFieldDecorator('userrole', {})(<Cascader
              size='large'
              style={{width: '100%'}}
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
            <Footer otherClass={styles.footerlogin}/>
          </p>
        </Row>
      </form>
    </div>
  </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
