import { Modal, Tabs } from 'antd'
import { DataQuery } from 'components'

const { Product } = DataQuery
const TabPane = Tabs.TabPane

const ModalProduct = ({ modalProductVisible, ...modalProductProps }) => {
  return (
    <Modal
      width="80%"
      height="80%"
      footer={null}
      {...modalProductProps}
    >
      <Tabs type="card">
        <TabPane tab="Products" key="0">
          {modalProductVisible && <Product {...modalProductProps} />}
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default ModalProduct
