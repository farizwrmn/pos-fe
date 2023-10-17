import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Modal, Row, Form, Input, Col } from 'antd'
import { config } from 'utils'
import Fingerprint from './Fingerprint'
import styles from './index.less'

const { authBy } = config
const FormItem = Form.Item

const ModalLogin = ({
  login,
  dispatch,
  modalLoginType,
  modalLoginData,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll
    // getFieldsValue
  },
  ...modalProps
}) => {
  const {
    loginLoading,
    // listUserRole,
    // visibleItem,
    // logo
    modalFingerprintVisible
  } = login

  // const handleCompany = () => {
  //   let fields = getFieldsValue()
  //   fields.company && dispatch({ type: 'login/getCompany', payload: { cid: fields.company.toUpperCase() } })
  // }
  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) { return }
      dispatch({ type: 'login/verify', payload: values })
    })
  }

  const modalFingerprintProps = {
    modalLoginType,
    modalLoginData,
    title: 'Fingerprint Verification',
    footer: null,
    okText: 'Ok',
    dispatch,
    cancelText: 'Cancel',
    visible: modalFingerprintVisible,
    onCancel () {
      dispatch({
        type: 'login/updateState',
        payload: {
          modalFingerprintVisible: false
        }
      })
    },
    registerFingerprint (payload) {
      console.log('Fingerprint Verification', payload)
      if (payload) {
        payload.transType = modalLoginData.transType
      }
      dispatch({
        type: 'employee/registerFingerprint',
        payload
      })
    }
  }

  return (
    <Modal {...modalProps}>
      {modalFingerprintVisible && <Fingerprint {...modalFingerprintProps} />}
      <form>
        <FormItem className={styles.formItem} hasFeedback>
          {getFieldDecorator(`user${authBy}`, {
            rules: [{ required: true }]
          })(<Input autoFocus size="large" placeholder="Username" />)}
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
        <Row>
          <Col span={4}>
            <Button
              shape="circle"
              size="large"
              onClick={() => {
                dispatch({
                  type: 'login/updateState',
                  payload: {
                    modalFingerprintVisible: true
                  }
                })
              }}
            >
              <img
                alt="fingerprint"
                src="/fingerprint.svg"
                className={styles.fingerprint}
              />
            </Button>
          </Col>
          <Col span={20}>
            <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>Sign in</Button>
          </Col>
        </Row>
      </form>
    </Modal>
  )
}

ModalLogin.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ login }) => ({ login }))(Form.create()(ModalLogin))
