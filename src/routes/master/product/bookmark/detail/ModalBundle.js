import { Modal, Tabs } from 'antd'
import { DataQuery } from 'components'

const { Promo } = DataQuery
const TabPane = Tabs.TabPane

const ModalBundle = ({ modalBundleVisible, ...otherProps }) => {
  return (
    <Modal
      width="80%"
      height="80%"
      footer={null}
      {...otherProps}
    >
      <Tabs type="card">
        <TabPane tab="Products" key="0">
          {modalBundleVisible && <Promo detail={false} {...otherProps} />}
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default ModalBundle
