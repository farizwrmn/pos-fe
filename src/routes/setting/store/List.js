import React from 'react'
import PropTypes from 'prop-types'
import { Tree, Card, Modal, Button } from 'antd'
import styles from './index.less'

const TreeNode = Tree.TreeNode

const List = ({ listStore, editItem, modalEdit, onSelectMenu, onCancelSelect }) => {
  const selectedItem = (item) => {
    onSelectMenu(item)
  }

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={(<span onClick={() => selectedItem(item)}>{item.title}</span>)}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={(<span onClick={() => selectedItem(item)}>{item.title}</span>)} key={item.id} />
    })
  }

  const modalProps = {
    title: 'Edit Store',
    visible: modalEdit.visible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    footer: [
      <Button type="primary" onClick={() => editItem()}>Edit</Button>
    ],
    onCancel () {
      onCancelSelect()
    }
  }

  return (
    <div>
      {modalEdit.visible && <Modal {...modalProps}>Do you want to edit {modalEdit.item.title}?</Modal>}
      <Card title="Stores" className={styles.card}>
        <Tree
          className="draggable-tree"
        >
          {renderTreeNodes(listStore)}
        </Tree>
      </Card>
    </div>
  )
}

List.propTypes = {
  listStore: PropTypes.array,
  editItem: PropTypes.object,
  modalEdit: PropTypes.string,
  onSelectMenu: PropTypes.func,
  onCancelSelect: PropTypes.func
}

export default List
