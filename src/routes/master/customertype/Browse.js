import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Popconfirm, Dropdown, Menu } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const BrowseGroup = ({
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
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.typeCode)
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
          col_1:{ text: 'Kode', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers'},
          col_2:{ text: 'Tipe Customer', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers'},
          col_3:{ text: 'Discount-1', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_4:{ text: 'Discount-2', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_5:{ text: 'Discount-3', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_6:{ text: 'Discount(Nominal)', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_7:{ text: 'Kategori', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
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
          row.push( { text: (data.typeCode||'').toString(), alignment: 'center'  } )
          row.push( { text: (data.typeName||'').toString(), alignment: 'center' } )
          row.push( { text: (data.discPct01||'').toString(), alignment: 'center' })
          row.push( { text: (data.discPct02||'').toString(), alignment: 'center' })
          row.push( { text: (data.discPct03||'').toString(), alignment: 'center' })
          row.push( { text: (data.discNominal||'').toString(), alignment: 'center' })
          row.push( { text: (data.sellPrice||'').toString(), alignment: 'center' })
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
        { text: 'LAPORAN DAFTAR TIPE CUSTOMER', margin: [150, 10], style: 'header' },
        {
          style: 'tableExample',
          writable: true,
          table: {
            widths: ['10%','20%','10%','10%','10%','20%','20%'],
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
      title: 'Code',
      dataIndex: 'typeCode',
      key: 'typeCode',
      width: '8%'
    }, {
      title: 'Type',
      dataIndex: 'typeName',
      key: 'typeName',
      width: '15%'
    }, {
      title: 'DISC(%)-1',
      dataIndex: 'discPct01',
      key: 'discPct01',
      width: '13%'
    }, {
      title: 'DISC(%)-2',
      dataIndex: 'discPct02',
      key: 'discPct02',
      width: '12%'
    }, {
      title: 'DISC(%)-3',
      dataIndex: 'discPct03',
      key: 'discPct03',
      width: '12%'
    }, {
      title: 'DISC(nominal)',
      dataIndex: 'discNominal',
      key: 'discNominal',
      width: '20%',
    },
    {
      title: 'Category',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '13%',
    }, {
      title: 'Operation',
      key: 'operation',
      fixed: 'right',
      render: (text, record) => {
        return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
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
          <Dropdown overlay={menu}>
            <Button>
              <Icon type="printer" /> Print
            </Button>
          </Dropdown>
          <Button onClick={hdlButtonSearchClick}>
            <Icon type="search" /> Search
          </Button>
          { selectedRowKeysLen > 1 &&
          <Popconfirm title={'Are you sure delete these items?'} onConfirm={() => hdlButtonDeleteClick(selectedRowKeys)}>
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
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 300, y: 240 }}
        columns={columns}
        simple
        rowKey={record => record.userId}
      />
    </div>
  )
}

BrowseGroup.propTypes = {
  onAddItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default BrowseGroup
