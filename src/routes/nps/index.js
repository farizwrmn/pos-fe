import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Input, Form, message } from 'antd'
import styles from './index.less'

const { TextArea } = Input

const Nps = ({
  nps,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const { npsData } = nps
  const setRate = (score) => {
    let rate = Object.assign({}, { score })
    dispatch({
      type: 'nps/updateState',
      payload: {
        npsData: rate
      }
    })
  }

  let buttons = []
  for (let i = 0; i <= 10; i += 1) {
    buttons.push(<Button
      onClick={() => setRate(i)}
      shape="circle"
      size="large"
      type={npsData ? (npsData.score === i ? 'primary' : 'default') : 'default'}
    >{i}</Button>)
  }

  const sendNPS = () => {
    let { memberId, memo } = getFieldsValue()
    memo = memo || ''
    if (!memberId || !npsData) {
      message.warning('You forget to entry ID or hit the rate button')
    } else {
      let data = Object.assign(npsData, { memo, date: moment(new Date()).format('YYYY-MM-DD') })
      dispatch({
        type: 'nps/postNPS',
        payload: {
          id: memberId,
          data
        }
      })
    }
  }

  const findName = (e) => {
    const { value } = e.target
    setTimeout(() => {
      const { memberId } = getFieldsValue()
      if (value === memberId) {
        dispatch({
          type: 'nps/getMember',
          payload: {
            memberId: value
          }
        })
      }
    }, 1000)
  }

  return (
    <div className={styles.container}>
      <h2>
        <span>We`d love your help. </span>
        Please give us 30 seconds of your time for feedback on our website
      </h2>
      <div className={styles.body}>
        <p>ID :
        {getFieldDecorator('memberId')(<Input onChange={e => findName(e)} />)}
        </p>
        <p>How likely is it that you would recommend our service to a friend or colleague?</p>
        <div>
          {buttons}
        </div>
        <p>
          Message
          {getFieldDecorator('memo')(<TextArea />)}
        </p>
        <Button onClick={sendNPS} type="primary" size="large">Send</Button>
      </div>
    </div>
  )
}

export default connect(({ nps }) => ({ nps }))(Form.create()(Nps))
