import { Modal, Tree } from 'antd'

const TreeNode = Tree.TreeNode

const renderTreeNodes = (data) => {
  return data.map((item) => {
    return <TreeNode key={String(item.id)} title={item.storeName} />
  })
}

const ModalForm = ({
  ...modalProps,
  listAllStores,
  currentMachineStore,
  handleRowCheck
}) => {
  return (
    <Modal {...modalProps}>
      <Tree
        checkable
        checkStrictly
        autoExpandParent
        checkedKeys={currentMachineStore}
        onCheck={handleRowCheck}
      >
        {renderTreeNodes(listAllStores)}
      </Tree>
    </Modal>
  )
}

export default ModalForm
