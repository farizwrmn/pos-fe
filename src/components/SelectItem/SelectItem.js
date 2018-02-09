import React from 'react'
import { Select } from 'antd'

const Option = Select.Option

class SelectItem extends React.Component {
  constructor (props) {
    super(props)
    const value = this.props.value || {}
    this.state = {
      option: value.option || []
    }
  }
  componentWillReceiveProps (nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState(value)
    }
  }
  handleChange = (option) => {
    let { list, componentKey } = this.props
    if (('value' in this.props)) {
      const allValue = list.length > 0 ? list.map(x => x[componentKey]) : []
      if (option.includes('-1')) {
        option = allValue
      }
      this.setState({ option })
    }
    this.triggerChange({ option })
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue))
    }
  }
  render () {
    const { list, mode, size, style, componentKey, allowClear, componentValue, placeholder } = this.props
    const state = this.state
    let options = []
    options.push(<Option value="-1">Select All</Option>)
    for (let key = 0; key < list.length; key += 1) {
      options.push(<Option value={list[key][componentKey]}>{list[key][componentValue]}</Option>)
    }
    return (
      <span>
        <Select
          mode={mode || 'combobox'}
          value={state.option}
          style={style || { width: '100%' }}
          onChange={this.handleChange}
          placeholder={placeholder || ''}
          allowClear={allowClear || true}
          size={size}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {options}
        </Select>
      </span>
    )
  }
}

export default SelectItem
