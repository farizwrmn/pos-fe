import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'dva'
// import { Link, routerRedux } from 'dva/router'
// import { Button, Tabs } from 'antd'
// import Form from './Form'
// import List from './List'
// import Filter from './Filter'

// const formProps = {
//   modalType,
//   item: currentItem,
//   button: `${modalType === 'add' ? 'Add' : 'Update'}`,
//   onSubmit (data, reset) {
//     dispatch({
//       type: `accountCode/${modalType}`,
//       payload: {
//         data,
//         reset
//       }
//     })
//   },
//   onCancel () {
//     const { pathname } = location
//     dispatch(routerRedux.push({
//       pathname,
//       query: {
//         activeKey: '1'
//       }
//     }))
//     dispatch({
//       type: 'accountCode/updateState',
//       payload: {
//         currentItem: {}
//       }
//     })
//   }
// }

const SubaPromo = ({
  subaPromo
}) => {
  // const { list, pagination, modalType, currentItem, activeKey  } = subaPromo
  const { list } = subaPromo
  console.log('list', list)

  return (
    <div>
      SubaPromo
    </div>
  )
}

SubaPromo.propTypes = {
  // form: PropTypes.object.isRequired,
  // customer: PropTypes.object.isRequired
}

SubaPromo.defaultProps = {
  subaPromo: {}
  // customer: {},
  // addNew: true
}

export default connect(({ subaPromo }) => ({ subaPromo }))(SubaPromo)

