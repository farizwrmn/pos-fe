import { Modal, Tabs } from 'antd'
import { DataQuery } from 'components'

const { ProductFilter, Service } = DataQuery
const TabPane = Tabs.TabPane

const Products = ({ modalProductVisible, getProduct, getService, ...modalProductProps }) => {
  const changeKey = (key) => {
    if (key === '0') {
      getProduct()
    } else if (key === '1') {
      getService()
    }
  }
  return (
    <Modal
      width="80%"
      height="80%"
      footer={null}
      {...modalProductProps}
    >
      <Tabs type="card" onChange={key => changeKey(key)}>
        <TabPane tab="Product" key="0">
          <ProductFilter {...modalProductProps} />
        </TabPane>
        <TabPane tab="Service" key="1">
          <Service {...modalProductProps} />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default Products
