import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Radio, Card } from 'antd'

const RadioGroup = Radio.Group

const ListItem = ({ formMainType, listWorkOrderCategory, transData, editListItem, ...tableProps }) => {
  const editable = (formMainType !== 'add' && !!transData.id)
  const handleChange = (e, type) => {
    const { name, id, value } = e.target
    editListItem(name || id, value, type)
  }
  const RadioComponent = (text, record) => (
    <div onClick={(e) => { e.stopPropagation() }} >
      <RadioGroup name={record.id} value={record.value || 4} onChange={key => handleChange(key, 'radio')} defaultValue={4}>
        <Radio disabled={editable} value={1}>Good</Radio>
        <Radio disabled={editable} value={2}>Normal</Radio>
        <Radio disabled={editable} value={3}>Bad</Radio>
        <Radio disabled={editable} value={4}>Not-checked</Radio>
      </RadioGroup>
    </div>
  )
  const InputComponent = (text, record) => (
    <div key={record.id} onClick={(e) => { e.stopPropagation() }} >
      <Input disabled={editable} placeholder="Memo" key={record.id} id={record.id} value={record.memo || null} onChange={value => handleChange(value, 'input')} />
    </div>
  )

  const columns = [
    {
      title: 'Parent Category',
      dataIndex: 'categoryParentName',
      key: 'categoryParentName',
      width: '100px'
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '100px'
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      width: '250px',
      // render: (id) => {
      //   return (
      //     <span>
      //       <a href="#" onClick={(e) => { e.stopPropagation(); handleChange(id); }}>
      //         Clone
      //       </a>
      //       <span className="ant-divider" />
      //       <a href="#" onClick={(e) => { e.stopPropagation(); handleChange(id); }}>
      //         Replace
      //       </a>
      //     </span>
      //   );
      // }
      render: (text, record) => {
        return RadioComponent(text, record)
      }
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo',
      width: '150px',
      render: (text, record) => {
        return InputComponent(null, record)
      }
    }
  ]
  return (
    <div>
      {window.screen.width <= 768 ?
        (listWorkOrderCategory.map((data) => {
          return (
            <Card style={{ width: '100%' }} key={data.id} title={`${data.categoryParentName ? `${data.categoryParentName} - ` : ''}${data.categoryName}`} bordered={false}>
              <br />
              <div>Condition : </div>
              <br />
              <RadioGroup name={data.id} value={data.value || 4} onChange={key => handleChange(key, 'radio')} defaultValue={4}>
                <div><Radio disabled={editable} value={1}>Good</Radio></div>
                <div><Radio disabled={editable} value={2}>Normal</Radio></div>
                <div><Radio disabled={editable} value={3}>Bad</Radio></div>
                <div><Radio disabled={editable} value={4}>Not-checked</Radio></div>
              </RadioGroup>
              <br />
              <br />
              <div>Memo : </div>
              <br />
              <Input disabled={editable} placeholder="Memo" id={data.id} value={data.memo || null} onChange={value => handleChange(value, 'input')} />
              <br />
            </Card>
          )
        })) :
        <Table {...tableProps}
          bordered
          columns={columns}
          simple
          size="small"
          scroll={{ x: 1000 }}
        />}
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListItem
