import { Col, Form, InputNumber, Table } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: 8,
    sm: 8,
    md: 4,
    lg: 4,
    xl: 2
  },
  wrapperCol: {
    xs: 16,
    sm: 16,
    md: 20,
    lg: 20,
    xl: 18
  }
}

const TableClose = ({
  getFieldDecorator,
  balanceInputPaymentOption,
  listOpts
}) => {
  const availableOpts = balanceInputPaymentOption && Array.isArray(balanceInputPaymentOption) ? balanceInputPaymentOption : ['C', 'GM']

  const availableListOpts = listOpts.filter(filtered => availableOpts.find(item => item === filtered.typeCode))
  const inputColumns = availableListOpts.map((record) => {
    return ({
      title: record.typeName,
      dataIndex: 'type',
      key: `type#${record.typeCode}`,
      render: () => {
        return (
          <FormItem>
            {getFieldDecorator(`input#${record.typeCode}`, {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: `${record.typeName} input required!`
                }
              ]
            })(
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        )
      }
    })
  })

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    ...inputColumns
  ]

  const dataSource = [
    {
      description: 'Cashier Input'
    }
  ]

  return (
    <FormItem label="Cashier Input" {...formItemLayout}>
      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
        />
      </Col>
    </FormItem>
  )
}

export default TableClose
