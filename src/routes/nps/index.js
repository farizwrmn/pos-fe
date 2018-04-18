import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { LocaleProvider, Button, Input, Form, message } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
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
  let memberName = ''
  if (npsData.member) memberName = npsData.member.memberName
  const setRate = (score) => {
    if (npsData.member) {
      let rate = Object.assign(npsData, { score })
      dispatch({
        type: 'nps/updateState',
        payload: {
          npsData: rate
        }
      })
    } else {
      message.warning('Please entry the member id')
    }
  }

  let buttons = []
  for (let i = 0; i <= 10; i += 1) {
    if (i >= 0 && i <= 6) {
      buttons.push(<Button
        onClick={() => setRate(i)}
        shape="circle"
        size="large"
        style={{ background: npsData ? (npsData.score === i ? '#96999e' : '#f94036') : '#f94036' }}
      // type={npsData ? (npsData.score === i ? 'primary' : 'default') : 'default'}
      >{i}</Button>)
    } else if (i >= 7 && i <= 8) {
      buttons.push(<Button
        onClick={() => setRate(i)}
        shape="circle"
        size="large"
        style={{ background: npsData ? (npsData.score === i ? '#96999e' : '#f9cb57') : '#f9cb57' }}
      // type={npsData ? (npsData.score === i ? 'primary' : 'default') : 'default'}
      >{i}</Button>)
    } else if (i >= 9 && i <= 10) {
      buttons.push(<Button
        onClick={() => setRate(i)}
        shape="circle"
        size="large"
        style={{ background: npsData ? (npsData.score === i ? '#96999e' : '#67e559') : '#67e559' }}
      // type={npsData ? (npsData.score === i ? 'primary' : 'default') : 'default'}
      >{i}</Button>)
    }

  }

  const sendNPS = () => {
    let { memberId, memo } = getFieldsValue()
    memo = memo || ''
    if (!memberId || !npsData) {
      message.warning('You forget to entry ID')
    } else if (!npsData.hasOwnProperty('score')) {
      message.warning('You forget to hit the rate button')
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
      if (value === memberId && value !== '') {
        dispatch({
          type: 'nps/getMember',
          payload: {
            memberId: value
          }
        })
      }
    }, 300)
  }

  return (
    <LocaleProvider locale={enUS}>
    <div className={styles.container}>
      <h2>
        <span>We`d love your help. </span>
        Please give us 30 seconds of your time for feedback on our website
      </h2>
      <div className={styles.body}>
        <p>ID :
        {getFieldDecorator('memberId')(<Input onChange={e => findName(e)} />)}
          <span className={styles.name}>{memberName}</span>
        </p>
        <p>How likely is it that you would recommend our service to a friend or colleague?</p>
        <div>
          {buttons}
        </div>
        <p>
          Message
          {getFieldDecorator('memo')(<TextArea style={{ height: '50px' }} />)}
        </p>
        <Button onClick={sendNPS} type="primary" size="large">Send</Button>
      </div>
    </div>
    </LocaleProvider>
  )
}

export default connect(({ nps }) => ({ nps }))(Form.create()(Nps))
