import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Icon, Popconfirm, Tag, Dropdown, Menu } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const Browse = ({
  onAddItem, onEditItem, onDeleteItem, onDeleteBatch, onSearchShow,
  ...tableProps }) => {

  const hdlButtonAddClick = () => {
    onAddItem()
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
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record [ ${record.productCode} ] ?`,
        onOk () {
          onDeleteItem(record.productCode)
        },
      })
    }
  }

  const hdlButtonPrintClick = (e) => {
    if (e.key === '1') {
      onPrintPDF()
    } else if (e.key === '2') {
      console.log('add print other here')
    }
  }

  const onPrintPDF = () => {
    function createPdfLineItems(tabledata) {
      var headers = {
        top:{
          col_1:{ text: 'Code', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers'},
          col_2:{ text: 'Product Name', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers'},
          col_3:{ text: 'Brand', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_4:{ text: 'Kategori', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_5:{ text: 'Harga Jual', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_6:{ text: 'Biaya Jual', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_7:{ text: 'Dist Price-1', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_8:{ text: 'Dist Price-2', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_9:{ text: 'Nama Lain', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_10:{ text: 'Brand ID', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          // col_3:{ text: 'Point', style: 'tableHeader', alignment: 'center' },
          // col_4:{ text: 'Mobile', style: 'tableHeader', alignment: 'center' },
          // col_5:{ text: 'Phone', style: 'tableHeader', alignment: 'center'}
        }
      }
      var rows = tabledata;
      var body = [];
      for (var key in headers){
        if (headers.hasOwnProperty(key)){
          var header = headers[key]
          var row = new Array()
          row.push( header.col_1 )
          row.push( header.col_2 )
          row.push( header.col_3 )
          row.push( header.col_4 )
          row.push( header.col_5 )
          row.push( header.col_6 )
          row.push( header.col_7 )
          row.push( header.col_8 )
          row.push( header.col_9 )
          row.push( header.col_10 )
          body.push(row);
        }
      }
      for (var key in rows)
      {
        if (rows.hasOwnProperty(key))
        {
          console.log('data', data)
          var data = rows[key];
          var row = new Array();
          row.push( { text: (data.productCode||'').toString(), alignment: 'center'  } )
          row.push( { text: (data.productName||'').toString(), alignment: 'center' } )
          row.push( { text: (data.brandName||'').toString(), alignment: 'center' })
          row.push( { text: (data.categoryName||'').toString(), alignment: 'center' })
          row.push( { text: (data.sellPrice||'').toString(), alignment: 'center' })
          row.push( { text: (data.costPrice||'').toString(), alignment: 'center' })
          row.push( { text: (data.distPrice01||'').toString(), alignment: 'center' })
          row.push( { text: (data.distPrice02||'').toString(), alignment: 'center' })
          row.push( { text: (data.otherName01||'').toString(), alignment: 'center' })
          row.push( { text: (data.brandId||'').toString(), alignment: 'center' })
          body.push(row);
        }
        layout: 'lightHorizontalLines'
      }
      return body;
    }
    var body = createPdfLineItems(tableProps.dataSource)
    var currentDate = new Date()
    var datetime = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds()

    var docDefinition = {


      footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount },

      function(getDate) {
        var today = new Date(),
          date = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear()

        return date
      },

      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [ 40, 30, 40, 30 ],
      content: [
        { text: 'TYRE MASTER', style: 'header2', fontSize: 15},
        { text: 'Jalan Gatot Subroto No.132 C D'},
        { text: 'Medan'},
        { text: 'Telp. 061-42008012'},
        { text: 'LAPORAN DATA STOK', margin: [240, 10], style: 'header' },
        {
          style: 'tableExample',
          writable: true,
          table: {
            widths: ['8%','20%','8%','8%','8%','8%','8%','8%','16%','8%'],
            body: body,

            // margin: [0,0,0,10]
          },
          layout: 'lightHorizontalLines',
        },
        { text: ' ', margin:[0,0,0,15] },
        { text: 'Print Date: ' + datetime },

      ],
      styles: {
        header: {
          fontSize: 28,
          bold: true,
        },
      },
    }
    pdfMake.createPdf(docDefinition).open()
  }

  const menu = (
    <Menu onClick={e => hdlButtonPrintClick(e)}>
      <Menu.Item key="1" >PDF</Menu.Item>
      <Menu.Item key="2">Excel</Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: '114px',
      render: (active) =>
        <span>
          <Tag color={active?'blue' : 'red'}>
            {active?'Active' : 'Non-Active'}
          </Tag>
        </span>,
    },
    {
      title: 'P.Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '125px',
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '260px',
    }, {
      title: 'Brand',
      dataIndex: 'brandName',
      key: 'brandName',
      width: '100px',
    }, {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '100px',
    }, {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '90px',
    },
    // {
    //   title: 'Location 1',
    //   dataIndex: 'location01',
    //   key: 'location01',
    // }, {
    //   title: 'Location 2',
    //   dataIndex: 'location02',
    //   key: 'location02',
    // },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: '90px',
    }, {
      title: 'Dist 01',
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      width: '90px',
    }, {
      title: 'Dist 2',
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      width: '90px',
    }, {
      title: 'Track Qty',
      dataIndex: 'trackQty',
      key: 'trackQty',
      width: '90px',
      render: (active) =>
        <span>
          <Tag color={active?'blue' : 'red'}>
            {active?'True' : 'False'}
          </Tag>
        </span>,
    }, {
      title: 'Alert Qty',
      dataIndex: 'alertQty',
      key: 'alertQty',
      width: '90px',
    }, {
      title: 'Exception',
      dataIndex: 'exception01',
      key: 'exception01',
      width: '90px',
      render: (active) =>
        <span>
          <Tag color={active?'blue' : 'red'}>
            {active?'True' : 'False'}
          </Tag>
        </span>,
    }, {
      title: 'Image',
      dataIndex: 'productImage',
      key: 'productImage',
      width: '90px',
    }, {
      title: 'D.Code',
      dataIndex: 'dummyCode',
      key: 'dummyCode',
      width: '125px',
    }, {
      title: 'Dummy Name',
      dataIndex: 'dummyName',
      key: 'dummyName',
      width: '260px',
    },
    // {
    //   title: 'Similar 1',
    //   dataIndex: 'otherName01',
    //   key: 'otherName01',
    //   width: '260px',
    // }, {
    //   title: 'Similar 2',
    //   dataIndex: 'otherName02',
    //   key: 'otherName02',
    //   width: '260px',
    // },
    // {
    //   title: 'barCode 1',
    //   dataIndex: 'barCode01',
    //   key: 'barCode01',
    // }, {
    //   title: 'barCode 2',
    //   dataIndex: 'barCode02',
    //   key: 'barCode02',
    // },
    {
      title: 'B.ID',
      dataIndex: 'brandId',
      key: 'brandId',
      width: '90px',
    }, {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: '90px',
        }, {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (text) => `${moment(text).format('LL LTS')}`
        }
      ]
    }, {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: '90px',
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          render: (text) => `${moment(text).format('LL LTS')}`
        }
      ]
    }, {
      title: 'Operation',
      key: 'operation',
      fixed: 'right',
      width: '73px',
      render: (text, record) => {
        return <DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
          menuOptions = {[
            { key: '1', name: 'Edit', icon: 'edit' },
            { key: '2', name: 'Delete', icon: 'delete' }
          ]}
        />
      }
    }
  ]

  let selectedRowKeysLen = 0
  let selectedRowKeys
  if (tableProps.rowSelection) {
    selectedRowKeysLen = tableProps.rowSelection.selectedRowKeys.length
    selectedRowKeys= tableProps.rowSelection.selectedRowKeys
  }
  return (
    <div>
      <div style={{ 'margin-bottom': '10px' }}>
        <ButtonGroup size='small'>
          <Button type='primary' onClick={hdlButtonAddClick}>
            <Icon type='plus-circle-o' /> Add
          </Button>
          <Dropdown overlay={menu}>
            <Button>
              <Icon type="printer" /> Print
            </Button>
          </Dropdown>
          <Button onClick={hdlButtonSearchClick}>
            <Icon type='search'/> Search
          </Button>
          { selectedRowKeysLen > 1 &&
          <Popconfirm title={'Are you sure delete these items?'} onConfirm={ () => hdlButtonDeleteClick(selectedRowKeys) }>
            <Button type='danger'>
              <Icon type='delete'/> Batch Delete
            </Button>
          </Popconfirm>
          }
        </ButtonGroup>
        <span style={{ marginLeft: 8 }}>
        { selectedRowKeysLen > 0 && `${selectedRowKeysLen} items were selected`}
      </span>
      </div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 2550, y: 240 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
      />
    </div>
  )
}

Browse.propTypes = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default Browse
