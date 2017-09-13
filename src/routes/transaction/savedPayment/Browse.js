import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Icon, Input, Tag } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

const BrowseGroup = ({
  dataSource, onGetDetail, onShowCancelModal,
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
          const match = record.transNo.match(reg) || record.transDate.match(reg) || record.policeNo.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            name: (
              <span>
              {(record.transNo.split(reg) || record.transDate.split(reg) || record.policeNo.split(reg) ).map((text, i) => (
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
          title: 'No',
          dataIndex: 'transNo',
          key: 'transNo',
          width: 200,
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
          title: 'Date',
          dataIndex: 'transDate',
          key: 'transDate',
          width: 230,
        },
        {
          title: 'Car Unit',
          dataIndex: 'policeNo',
          key: 'policeNo',
          width: 200,
        },
        {
          title: 'KM',
          dataIndex: 'lastMeter',
          key: 'lastMeter',
          width: 200,
        },
        {
          title: 'Cashier',
          dataIndex: 'cashierId',
          key: 'cashierId',
          width: 220,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          render: (text) =>
            <span>
              <Tag color={text === 'A' ? 'blue' : text === 'C' ? 'red' : 'green'}>
                {text === 'A' ? 'Active' : text === 'C' ? 'Canceled' : 'Non-Active'}
              </Tag>
            </span>,
        },
        {
          title: <Icon type="setting" />,
          key: 'operation',
          fixed: 'right',
          width: 75,
          render: (text, record) => {
            return (<DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
              type="primary"
              menuOptions={[
                { key: '1', name: 'Print', icon: 'printer' },
                { key: '2', name: 'Void', icon: 'delete' },
              ]}
            />)
          },
        },
      ]
      return <Table pageSize={5} size="small" scroll={{ x: 1225, y: 500 }} bordered columns={columns} dataSource={this.state.data} />;
    }
  }
  const hdlDropOptionClick = (record, e) => {
    if (e.key === '1') {
      onGetDetail(record)
    } else if (e.key === '2') {
      onShowCancelModal(record)
    }
  }

  return (
    <div>
      <App {...tableProps} />
    </div>
  )
}

BrowseGroup.propTypes = {
  location: PropTypes.object,
  onGetDetail: PropTypes.func,
  onShowCancelModal: PropTypes.func,
  dataSource: PropTypes.array,
}

export default BrowseGroup
