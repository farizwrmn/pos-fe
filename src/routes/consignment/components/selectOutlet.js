import { Col, Row, Select } from 'antd'
import React from 'react'

const Option = Select.Option

function SelectOutlet ({ outletList, searchOutlet, selectOutlet, selectedOutlet }) {
  const outletOption = outletList.length > 0 ? outletList.map((record, index) => {
    return (
      <Option value={record.id} key={index}><strong>{record.outlet_name}</strong></Option>
    )
  }) : []

  let searchTimeOut

  const onSearchOutlet = (value) => {
    if (searchTimeOut) {
      clearTimeout(searchTimeOut)
      searchTimeOut = null
    }

    searchTimeOut = setTimeout(() => searchOutlet(value), 1000)
  }

  return (
    <Row>
      <Col span={18} />
      <Col span={6} >
        <Select
          style={{ width: '100%' }}
          defaultValue={
            selectedOutlet.id
          }
          showSearch
          onSearch={onSearchOutlet}
          placeholder="choose outlet"
          filterOption={false}
          onSelect={selectOutlet}
        >
          {outletOption}
        </Select>
      </Col>
    </Row>
  )
}

export default (SelectOutlet)
