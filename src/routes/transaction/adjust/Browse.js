import React from 'react'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

// const gridStyle = {
//   width: '60%',
//   textAlign: 'center'
// }
const Browse = ({ modalShow, item, dataBrowse, changeDisabledItem, templistType, modalProductVisible }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Product Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Cost',
      dataIndex: 'price',
      key: 'price',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'In',
      dataIndex: 'In',
      key: 'In',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Out',
      dataIndex: 'Out',
      key: 'Out',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    }
  ]

  const hdlModalShow = (record) => {
    if (modalProductVisible) {
      const value = item.transType
      const variable = templistType.filter(x => x.code === value)
      const { miscVariable } = variable[0]
      let disabledItem = {}
      let adjust = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      if (miscVariable === 'IN') {
        disabledItem.disabledItemOut = true
        disabledItem.disabledItemIn = false
        if (Object.keys(adjust).length > 0) {
          for (let n = 0; n < adjust.length; n += 1) {
            adjust[n].Out = 0
          }
          localStorage.setItem('adjust', JSON.stringify(adjust))
        }
      } else if (miscVariable === 'OUT') {
        disabledItem.disabledItemOut = false
        disabledItem.disabledItemIn = true
        if (Object.keys(adjust).length > 0) {
          for (let n = 0; n < adjust.length; n += 1) {
            adjust[n].In = 0
          }
          localStorage.setItem('adjust', JSON.stringify(adjust))
        }
      }
      changeDisabledItem(disabledItem)
    }
    modalShow(record)
  }

  return (
    <Table
      columns={columns}
      simple
      bordered
      pagination={{ pageSize: 5 }}
      size="small"
      dataSource={dataBrowse}
      onRowClick={record => hdlModalShow(record)}
    />
  )
}

export default Browse
