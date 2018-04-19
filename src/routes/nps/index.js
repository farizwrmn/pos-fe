import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { LocaleProvider, Button, Input, Form, message, Cascader, Select } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import styles from './index.less'

const { TextArea } = Input
const Option = Select.Option

const Nps = ({
  nps,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields
  }
}) => {
  const { npsData, searchBy, membersOfPlat } = nps
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
      >{i}</Button>)
    } else if (i >= 7 && i <= 8) {
      buttons.push(<Button
        onClick={() => setRate(i)}
        shape="circle"
        size="large"
        style={{ background: npsData ? (npsData.score === i ? '#96999e' : '#f9cb57') : '#f9cb57' }}
      >{i}</Button>)
    } else if (i >= 9 && i <= 10) {
      buttons.push(<Button
        onClick={() => setRate(i)}
        shape="circle"
        size="large"
        style={{ background: npsData ? (npsData.score === i ? '#96999e' : '#67e559') : '#67e559' }}
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
      if (searchBy.value === 'id') {
        dispatch({
          type: 'nps/postNPS',
          payload: {
            id: memberId,
            data
          }
        })
      } else if (searchBy.value === 'pn') {
        dispatch({
          type: 'nps/postNPS',
          payload: {
            id: npsData.member.memberCode,
            data
          }
        })
      }
      setTimeout(() => resetFields(), 500)
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
            memberId: value,
            searchBy
          }
        })
      } else {
        dispatch({
          type: 'nps/updateState',
          payload: {
            npsData: {}
          }
        })
      }
    }, 500)
  }

  const options = [
    {
      value: 'id',
      label: 'ID'
    },
    {
      value: 'pn',
      label: 'Police No'
    }
  ]

  const cascaderProps = {
    options,
    defaultValue: ['id'],
    onChange (value, selectedOptions) {
      resetFields(['memberId'])
      const searchBy = Object.assign({}, selectedOptions[0])
      dispatch({
        type: 'nps/updateState',
        payload: {
          searchBy
        }
      })
    }
  }

  let memberPlats
  if (membersOfPlat.length > 0) {
    memberPlats = membersOfPlat.map(x => (<Option value={x.memberCode}>{x.memberName}</Option>))
  }

  const selectProps = {
    onChange (value) {
      dispatch({
        type: 'nps/updateState',
        payload: {
          npsData: { member: { memberCode: value } }
        }
      })
    },
    size: 'large',
    style: { width: '27vw', marginLeft: 10 }
  }

  return (
    <LocaleProvider locale={enUS}>
      <div className={styles.container}>
        <h2>
          <span>We`d love your help. </span>
          Please give us 30 seconds of your time for feedback on our website
      </h2>
        <div className={styles.body}>
          <p><Cascader {...cascaderProps}><a className={styles.label}>{searchBy.label}</a></Cascader>
            {getFieldDecorator('memberId')(<Input size="large" style={{ width: searchBy.value === 'pn' ? '40%' : '50%' }} onChange={e => findName(e)} />)}
            {searchBy.value === 'id' && <span className={styles.name}>{memberName}</span>}
            {(searchBy.value === 'pn' && membersOfPlat.length > 0) &&
              <Select defaultValue={membersOfPlat[0].memberCode} {...selectProps}>
                {memberPlats}
              </Select>}
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
    </LocaleProvider >
  )
}

export default connect(({ nps }) => ({ nps }))(Form.create()(Nps))
