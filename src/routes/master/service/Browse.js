import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Button, Icon, Input, Popconfirm } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

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
  const hdlButtonPrintClick = () => {
    console.log('add print here')
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
          <Button onClick={hdlButtonPrintClick}>
            <Icon type="printer" /> Print
          </Button>
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
