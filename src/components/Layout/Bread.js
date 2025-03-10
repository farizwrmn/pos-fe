import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import moment from 'moment'
import { queryArray, lstorage } from 'utils'
import { Form, Breadcrumb, Icon, Select, Modal, Row, Col } from 'antd'
import { Link } from 'dva/router'
import styles from './Bread.less'

const Bread = ({
  form: {
    getFieldDecorator,
    setFieldsValue
  },
  menu,
  changeRole
}) => {
  // user store
  const listUserStores = lstorage.getListUserStores()
  const defaultStore = lstorage.getCurrentUserStore()

  const loginTimeDiff = lstorage.getLoginTimeDiff()

  // 匹配当前路由
  let pathArray = []
  let current
  for (let index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index]
      break
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'menuId'))
    }
  }

  if (!current) {
    pathArray.push(menu[0] || {
      id: 1,
      icon: 'laptop',
      name: 'Dashboard'
    })
    pathArray.push({
      id: 404,
      name: 'Not Found'
    })
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
        ? <Icon type={item.icon} style={{ marginRight: 4 }} />
        : ''}{item.name}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route}>
            {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  const handleChangeStore = (storeId) => {
    const selected = listUserStores.find(item => item.value === storeId)
    if (!selected) return
    const value = selected.value
    Modal.confirm({
      title: 'Warning: current Local storage will be delete',
      content: 'this action will delete current local storage',
      onOk () {
        const localId = lstorage.getStorageKey('udi')
        const serverTime = moment(new Date()).subtract(loginTimeDiff, 'milliseconds').toDate()
        const dataUdi = [
          localId[1],
          localId[2],
          value.toString(),
          localId[4],
          moment(new Date(serverTime)),
          localId[6],
          selected && selected.consignmentId ? selected.consignmentId.toString() : null
        ]
        lstorage.putStorageKey('udi', dataUdi, localId[0])
        localStorage.setItem('newItem', JSON.stringify({ store: false }))
        changeRole(value.toString())
        localStorage.removeItem('cashier_trans')
        localStorage.removeItem('queue')
        localStorage.removeItem('member')
        localStorage.removeItem('workorder')
        localStorage.removeItem('memberUnit')
        localStorage.removeItem('mechanic')
        localStorage.removeItem('service_detail')
        localStorage.removeItem('consignment')
        localStorage.removeItem('bundle_promo')
        localStorage.removeItem('cashierNo')
        setTimeout(() => { window.location.reload() }, 1000)
      },
      onCancel () {
        setFieldsValue({
          chooseStore: defaultStore
        })
      }
    })
  }

  return (
    <div className={styles.bread}>
      <Row>
        <Col xs={4} sm={10} md={10} lg={10} xl={12}>
          {window.screen.width >= 768 &&
            <Breadcrumb>
              {breads}
            </Breadcrumb>
          }
        </Col>
        <Col xs={20} sm={14} md={14} lg={14} xl={12}>
          <div className={styles.currentStore}>
            <Col span={14} />
            <Col span={4}>
              {getFieldDecorator('chooseStore', {
                initialValue: defaultStore
              })(<Select
                defaultValue={defaultStore}
                className={styles.currentStore}
                onSelect={handleChangeStore}
                changeOnSelect
                showSearch
                style={{ width: '250px' }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear={false}
                placeholder="Switch Store"
              >
                {listUserStores.map(item => <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>)}
              </Select>)}
            </Col>
          </div>
        </Col>
      </Row>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array
}

export default Form.create()(Bread)
