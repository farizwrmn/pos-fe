import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Input, Popconfirm, Dropdown, Menu } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const BrowseGroup = ({
  onAddItem, onEditItem, onDeleteItem, onDeleteBatch, onSearchShow, dataSource,
  ...tableProps }) => {
  const data = dataSource;

  class App extends React.Component {
    state = {
      filterDropdownVisible: false,
      data,
      searchText: '',
      filtered: false,
    };
    onInputChange = (e) => {
      this.setState({ searchText: e.target.value });
    }
    onSearch = () => {
      const { searchText } = this.state;
      const reg = new RegExp(searchText, 'gi');
      this.setState({
        filterDropdownVisible: false,
        filtered: !!searchText,
        data: data.map((record) => {
          const match = record.serviceCode.match(reg) || record.serviceName.match(reg) || record.serviceTypeId.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            name: (
              <span>
              {(record.serviceTypeId.split(reg) || record.serviceCode.split(reg) || record.serviceName.split(reg) ).map((text, i) => (
                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
            ),
          };
        }).filter(record => !!record),
      });
    }
    render() {
      const columns = [
        {
          title: 'Code',
          dataIndex: 'serviceCode',
          key: 'serviceCode',
          width: 100,
          filterDropdown: (
            <div className="custom-filter-dropdown">
              <Input
                ref={ele => this.searchInput = ele}
                placeholder="Search Code"
                value={this.state.searchText}
                onChange={this.onInputChange}
                onPressEnter={this.onSearch}
              />
              <Button type="primary" onClick={this.onSearch}>Search</Button>
            </div>
          ),
          filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
          filterDropdownVisible: this.state.filterDropdownVisible,
          onFilterDropdownVisibleChange: (visible) => {
            this.setState({
              filterDropdownVisible: visible,
            }, () => this.searchInput.focus());
          },
        },
        {
          title: 'Service',
          dataIndex: 'serviceName',
          key: 'serviceName',
          width: 300,
        },
        {
          title: 'Cost',
          dataIndex: 'cost',
          key: 'cost',
          width: 90,
        },
        {
          title: 'Service Cost',
          dataIndex: 'serviceCost',
          key: 'serviceCost',
          width: 90,
        },
        {
          title: 'Type',
          dataIndex: 'serviceTypeId',
          key: 'serviceTypeId',
          width: 100,
        },
        {
          title: 'Created',
          children: [
            {
              title: 'By',
              dataIndex: 'createdBy',
              key: 'createdBy',
              width: 70,
            }, {
              title: 'Time',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 170,
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
              width: 70,
            }, {
              title: 'Time',
              dataIndex: 'updatedAt',
              key: 'updatedAt',
              width: 170,
              render: text => `${moment(text).format('LL LTS')}`,
            },
          ],
        }, {
          title: 'Operation',
          key: 'operation',
          fixed: 'right',
          width: 72.73,
          render: (text, record) => {
            return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
                                menuOptions={[
                                  { key: '1', name: 'Edit', icon: 'edit' },
                                  { key: '2', name: 'Delete', icon: 'delete' },
                                ]}
            />)
          },
        },
        ];
      return <Table pageSize={5} size="small" scroll={{ x: 1235, y: 500}} bordered columns={columns} dataSource={this.state.data} />;
    }
  }
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
          onDeleteItem(record.groupCode)
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
          col_2:{ text: 'Nama Servis', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers'},
          col_3:{ text: 'Biaya', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_4:{ text: 'Biaya Servis', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
          col_5:{ text: 'Jenis', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13, style: 'headers' },
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
          row.push( { text: (data.serviceCode||'').toString(), alignment: 'left'  } )
          row.push( { text: (data.serviceName||'').toString(), alignment: 'left' } )
          row.push( { text: (data.cost||'').toString(), alignment: 'left' })
          row.push( { text: (data.serviceCost||'').toString(), alignment: 'left' })
          row.push( { text: (data.serviceTypeId||'').toString(), alignment: 'left' })
          body.push(row);
        }
        layout: 'lightHorizontalLines'
      }
      return body;
    }
    var body = createPdfLineItems(dataSource)
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
        { text: 'LAPORAN DAFTAR SERVIS', margin: [210, 10], style: 'header' },
        {
          style: 'tableExample',
          writable: true,
          table: {
            widths: ['18%','30%','16%','20%','16%'],
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
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: 100,
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 300,
    }, {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 90,
    }, {
      title: 'Service Cost',
      dataIndex: 'serviceCost',
      key: 'serviceCost',
      width: 90,
    }, {
      title: 'Type',
      dataIndex: 'serviceTypeId',
      key: 'serviceTypeId',
      width: 100,
    }, {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: 70,
        }, {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 170,
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
          width: 70,
        }, {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 170,
          render: text => `${moment(text).format('LL LTS')}`,
        },
      ],
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
      {/*<Table*/}
        {/*{...tableProps}*/}
        {/*bordered*/}
        {/*scroll={{ x: 1235, y: 240 }}*/}
        {/*columns={columns}*/}
        {/*simple*/}
        {/*size="small"*/}
        {/*rowKey={record => record.serviceCode}*/}
        {/*dataSource={dataSource}*/}
      {/*/>*/}
      <App {...tableProps}/>
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
