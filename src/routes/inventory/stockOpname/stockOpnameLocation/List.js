import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'
// import ModalEdit from './ModalEdit'

// const modalEditProps = {
//   visible: modalEditVisible,
//   item: modalEditItem,
//   detailData,
//   loading: loading.effects['pos/queryPosDetail'],
//   maskClosable: false,
//   title: modalEditItem ? modalEditItem.productCode : 'Update as finish?',
//   confirmLoading: loading.effects['stockOpname/finishLine'] || loading.effects['stockOpname/editQty'],
//   wrapClassName: 'vertical-center-modal',
//   onOk (data) {
//     dispatch({
//       type: 'stockOpnameLocation/finishLine',
//       payload: data
//     })
//   },
//   onCancel () {
//     dispatch({
//       type: 'stockOpnameLocation/updateState',
//       payload: {
//         modalEditVisible: false
//       }
//     })
//   }
// }

const List = ({ location, ...tableProps }) => {
  console.log('location', location)
  const columns = [
    {
      title: 'Location Name',
      dataIndex: 'locationName',
      className: styles.alignCenter,
      key: 'locationName'
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      className: styles.alignCenter,
      key: 'barcode'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
      {/* <ModalEdit {...modalEditProps} /> */}
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
