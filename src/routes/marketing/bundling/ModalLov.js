import { Modal, Tabs } from 'antd'
import { DataQuery } from 'components'

const { ProductFilter, ProductCategory, Service, ServiceCategory } = DataQuery
const TabPane = Tabs.TabPane

const Products = ({ type, modalProductVisible, getProduct, getService, ...modalProductProps }) => {
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
        {type === '1' && <TabPane tab="Service" key="1">
          <Service {...modalProductProps} />
        </TabPane>}
        {type === '1' && <TabPane tab="P.Category" key="2">
          <ProductCategory
            {...modalProductProps}
            enableFilter={false}
            showPagination={false}
          />
        </TabPane>}
        {type === '1' && <TabPane tab="S.Category" key="3">
          <ServiceCategory
            {...modalProductProps}
            enableFilter={false}
            showPagination={false}
          />
        </TabPane>}
      </Tabs>
    </Modal>
  )
}

export default Products
