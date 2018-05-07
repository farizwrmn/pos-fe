import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { LocaleProvider, Button, Input, Form, message, Cascader, Select, Tooltip, Row, Col } from 'antd'
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
        size="small"
        style={{ background: npsData ? (npsData.score === i ? '#96999e' : '#f24036') : '#f24036' }}
      >{i}</Button>)
    } else if (i >= 7 && i <= 8) {
      buttons.push(<Button
        onClick={() => setRate(i)}
        shape="circle"
        size="small"
        style={{ background: npsData ? (npsData.score === i ? '#96999e' : '#f9cb57') : '#f9cb57' }}
      >{i}</Button>)
    } else if (i >= 9 && i <= 10) {
      buttons.push(<Button
        onClick={() => setRate(i)}
        shape="circle"
        size="small"
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
      resetFields(['memberOpts'])
      const { memberId } = getFieldsValue()
      if (value === memberId && value !== '') {
        dispatch({
          type: 'nps/getMember',
          payload: {
            memberId: value,
            searchBy
          }
        })
      }
    }, 500)
  }

  const options = [
    {
      value: 'id',
      label: 'Member ID'
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
          membersOfPlat: [],
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
        type: 'nps/successGetData',
        payload: {
          npsData: { member: { memberCode: value } }
        }
      })
    },
    size: 'large',
    style: { fontSize: '15px', marginLeft: '15px', width: '240px' }
  }

  return (
    <LocaleProvider locale={enUS}>
      <Row type="flex" justify="space-around" align="middle">
        <Col lg={22} md={24}>
          <div className={styles.container}>
            <h1 style={{ textAlign: 'center' }}>
              <span>{npsData.cname}</span>
            </h1>
            <h3 style={{ textAlign: 'center' }}>
              <span>Dear {`${npsData.cname}'s`} Customer  </span>
            </h3>
            <div className={styles.body}>
              <p>
                <Row type="flex" justify="start" className={styles.antrowflex}>
                  <Tooltip title="click to change"
                           defaultVisible
                           visible={(!npsData.member)}
                           placement="topLeft"
                  >
                    <Col span={5}>
                      <Cascader {...cascaderProps}><a>{searchBy.label}</a></Cascader>
                    </Col>
                  </Tooltip>
                  <Col span={12}>
                    {getFieldDecorator('memberId')(<Input.Search size="large" style={{ width: '200px' }} onChange={e => findName(e)} />)}
                  </Col>
                </Row>
                {searchBy.value === 'id' &&
                <Row type="flex" justify="start" className={styles.antrowflex}>
                  <Col span={24}>
                    <span>{memberName ? `Selamat datang, ${memberName}` : null}</span>
                  </Col>
                </Row>
                }

                {(searchBy.value === 'pn' && membersOfPlat.length > 0) &&
                <Row type="flex" justify="start" className={styles.antrowflex}>
                  <Col span={5}>
                    <span>Member</span>
                  </Col>
                  <Col span={7}>
                    {getFieldDecorator('memberOpts')(
                      <Select defaultValue={membersOfPlat[0].memberCode} {...selectProps}>
                        {memberPlats}
                      </Select>
                    )}
                  </Col>
                </Row>}
              </p>
              <strong><h2 style={{ textAlign: 'center', color: 'blue' }}>Dari Skala 1-10, Apakah anda akan merekomendasikan layanan kami kepada saudara/teman/kerabat anda?</h2></strong>
              <strong><h3 style={{ textAlign: 'center', color: 'blue' }}>From Scale 1-10, How likely will you recommend our service to your family/friends/colleaugues?</h3></strong>
              <div>
                {buttons}
              </div>

              <p>Message</p>
              <Row>
                <Col lg={12} md={24}>
                  <div style={{ alignItems: 'center' }}>
                    {getFieldDecorator('memo')(<TextArea style={{ height: '80px' }} />)}
                  </div>
                </Col>
              </Row>
              <Button style={{ textAlign: 'center' }} onClick={sendNPS} type="primary" size="large">Send</Button>
            </div>
          </div>
        </Col>
      </Row>
    </LocaleProvider >
  )
}

export default connect(({ nps }) => ({ nps }))(Form.create()(Nps))
