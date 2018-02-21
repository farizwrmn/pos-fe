import React from 'react'
import PropTypes from 'prop-types'
import { Input, Select, Button, Icon } from 'antd'
import styles from './Search.less'

class Search extends React.Component {
  state = {
    clearVisible: false,
    selectValue: (this.props.select && this.props.selectProps) ? this.props.selectProps.defaultValue : ''
  }
  handleSearch = () => {
    const data = {
      keyword: this.node.value
    }
    if (this.props.select) {
      data.field = this.state.selectValue
    }
    if (this.props.onSearch) this.props.onSearch(data)
  }
  handleInputChange = (e) => {
    this.setState({
      ...this.state,
      clearVisible: e.target.value !== ''
    })
  }
  handleSelectChange = (value) => {
    this.setState({
      ...this.state,
      selectValue: value
    })
  }
  handleClearInput = () => {
    this.node.value = ''
    this.setState({
      clearVisible: false
    })
    this.handleSearch()
  }
  render () {
    const { size, select, selectOptions, selectProps, style, keyword } = this.props
    const { clearVisible } = this.state
    return (
      <Input.Group compact size={size} className={styles.search} style={style}>
        {select && <Select href="searchSelect" onChange={this.handleSelectChange} size={size} {...selectProps}>
          {selectOptions && selectOptions.map((item, key) => <Select.Option value={item.value} key={key}>{item.name || item.value}</Select.Option>)}
        </Select>}
        <Input href="searchInput" size={size} onChange={this.handleInputChange} onPressEnter={this.handleSearch} defaultValue={keyword} />
        <Button size={size} type="primary" onClick={this.handleSearch}>搜索</Button>
        {clearVisible && <Icon type="cross" onClick={this.handleClearInput} />}
      </Input.Group>
    )
  }
}


Search.propTypes = {
  size: PropTypes.string,
  select: PropTypes.bool,
  selectProps: PropTypes.object,
  onSearch: PropTypes.func,
  selectOptions: PropTypes.array,
  style: PropTypes.object,
  keyword: PropTypes.string
}

export default Search
