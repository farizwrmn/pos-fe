import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm } from 'antd'
import FaFileExcelO from 'react-icons/lib/fa/file-excel-o'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'
import Workbook from 'react-excel-workbook'
import styles from './List.less'
import classnames from 'classnames'
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;


const ButtonGroup = Button.Group
const confirm = Modal.confirm

const Browse = ({
  onChangeUnit, onPrint, onAddItem, dataSource, onEditItem, onDeleteItem, onDeleteBatch, onSearchShow,
  ...tableProps
}) => {
  const hdlButtonAddClick = () => {
    onAddItem()
  }
  const hdlButtonPrintClick = () => {
    onPrint()
  }
  const hdlButtonSearchClick = () => {
    onSearchShow()
  }
  const hdlButtonDeleteClick = (selectedRowKeys) => {
    onDeleteBatch(selectedRowKeys)
  }
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
      onChangeUnit(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.memberCode)
        },
      })
    }
  }
  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'memberCode',
      key: 'memberCode',
      width: '6%',
    },
    {
      title: 'Customer Name',
      dataIndex: 'memberName',
      key: 'memberName',
      width: '6%',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '6%',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      width: '6%',
    }, {
      title: 'Address 1',
      dataIndex: 'address01',
      key: 'address01',
      width: '8%',
    },
    {
      title: 'Address 2',
      dataIndex: 'address02',
      key: 'address02',
      width: '7%',
    },
    {
     title: 'City',
     dataIndex: 'cityName',
     key: 'cityName',
     width: '4%',
   },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: '5%',
      render: text => `${moment(text).format('L')}`,
    },
    {
      title: 'Identity Number',
      dataIndex: 'idNo',
      key: 'idNo',
      width: '6%',
    },
    // {
    //   title: 'Province',
    //   dataIndex: 'state',
    //   key: 'state',
    //   width: '4%',
    // },
    //  {
    //   title: 'Post Code',
    //   dataIndex: 'zipCode',
    //   key: 'zipCode',
    //   width: '5%',
    // },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      width: '12%',
    },
    // {
    //   title: 'Tax ID',
    //   dataIndex: 'taxId',
    //   key: 'taxId',
    //   width: '5%',
    // },
    {
      title: 'Type',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      width: '4%',
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: '4%',
        }, {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: '9%',
          render: text => `${moment(text).format('LL LTS')}`,
        },
      ],
    }, {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: '4%',
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: '9%',
          render: text => `${moment(text).format('LL LTS')}`,
        },
      ],
    }, {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          type="primary"
          menuOptions={[
            { key: '1', name: 'Edit', icon: 'edit' },
            { key: '2', name: 'Delete', icon: 'delete' },
          ]}
        />)
      },
    },
  ]

  let selectedRowKeysLen = 0
  let selectedRowKeys
  if (tableProps.rowSelection) {
    selectedRowKeysLen = tableProps.rowSelection.selectedRowKeys.length
    selectedRowKeys = tableProps.rowSelection.selectedRowKeys
  }
  return (
    <div>
      <div style={{ margin: '10px 0' }}>
        <ButtonGroup size="small">
          <Button type="primary" onClick={hdlButtonAddClick}>
            <Icon type="plus-circle-o" /> Add
          </Button>
          <Button onClick={() => hdlButtonPrintClick()}>
            <Icon type="printer" /> Print
          </Button>
          <Button onClick={hdlButtonSearchClick}>
            <Icon type="search" /> Search
          </Button>
          { selectedRowKeysLen > 1 &&
          <Popconfirm title={'Are you sure delete these items?'}
            onConfirm={() => hdlButtonDeleteClick(selectedRowKeys)}
          >
            <Button type="danger">
              <Icon type="delete" /> Batch Delete
            </Button>
          </Popconfirm>
          }
        </ButtonGroup>
        <span style={{ marginLeft: 8 }}>
          { selectedRowKeysLen > 0 && `${selectedRowKeysLen} items were selected`}
        </span>
      </div>
      <div style={{ margin: '0px 0px 10px 0px' }}>
        <Workbook filename="example.xlsx" element={<Button style={{ backgroundColor: '#207347', color: 'white' }} size='large'><FaFileExcelO />  Excel</Button>}>
          <Workbook.Sheet data={dataSource} name="Sheet 1">
            <Workbook.Column label="ID" value="memberCode"/>
            <Workbook.Column label="Name" value="memberName"/>
            <Workbook.Column label="Point" value="point"/>
            <Workbook.Column label="Phone" value="mobilePhone"/>
            <Workbook.Column label="address" value="address01"/>
          </Workbook.Sheet>
        </Workbook>
      </div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 2200, y: 300 }}
        columns={columns}
        simple
        rowKey={record => record.memberCode}
        dataSource={dataSource}
      />
    </div>
  )
}

Browse.propTyps = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onChangeUnit: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default Browse
