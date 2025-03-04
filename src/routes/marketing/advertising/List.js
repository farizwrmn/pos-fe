import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { IMAGEURL } from 'utils/config.company'
import { withoutFormat } from 'utils/string'

const confirm = Modal.confirm

const List = ({ ...tableProps, listAllStores, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.name} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'typeAds',
      key: 'typeAds'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '100px',
      render: (text, record) => {
        if (record && record.typeAds === 'CUSTROLL') {
          try {
            if (text
              && text != null
              && text !== '["no_image.png"]'
              && text !== '"no_image.png"'
              && text !== 'no_image.png') {
              const item = JSON.parse(text)
              if (item && item[0]) {
                return <img height="70px" src={`${IMAGEURL}/${withoutFormat(item[0])}-main.jpg`} alt="no_image" />
              }
            }
          } catch (error) {
            console.log('Error: ', error)
          }
        }
        if (text) {
          return <img height="70px" src={`${IMAGEURL}/${withoutFormat(text)}-main.jpg`} alt="no_image" />
        }
        return null
      }
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: 'Store',
      dataIndex: 'availableStore',
      key: 'availableStore',
      render: (text) => {
        if (!text) {
          return 'All'
        }
        const listStores = text && text.split(',')
        return listStores.map((storeId) => {
          const filteredStore = listAllStores.filter(filtered => filtered.id === Number(storeId))
          if (filteredStore && filteredStore[0]) {
            return filteredStore[0].storeName
          }
          return ''
        }).toString()
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', disabled: false, name: 'Delete' }]} />
      }
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
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
