import React from 'react'
import PropTypes from 'prop-types'
import { Tree, Card, Modal, Button } from 'antd'

const TreeNode = Tree.TreeNode

const List = ({ menuTree, onChangeTree, onEditItem, onDeleteItem, modalEdit, onSelectMenu, onCancelSelect }) => {
  const selectedItem = (key, title) => {
    onSelectMenu(key, title)
  }

  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode id={item.id} key={item.menuId} title={(<span onClick={() => selectedItem(item.menuId, item.name)}>{item.name}</span>)}>{getMenus(item.children)}</TreeNode>
      }
      return <TreeNode id={item.id} key={item.menuId} title={(<span onClick={() => selectedItem(item.menuId, item.name)}>{item.name}</span>)} />
    })
  }

  const onDrop = (info) => {
    const dragId = info.dragNode.props.id
    let dropKey = info.node.props.eventKey
    const dragKey = info.dragNode.props.eventKey
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    const getMenus = (menuTree, key, callback) => {
      menuTree.forEach((item, index, arr) => {
        if (item.menuId === key) {
          return callback(item, index, arr)
        }
        if (item.children) {
          return getMenus(item.children, key, callback)
        }
      })
    }

    let dragObj
    getMenus(menuTree, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })
    if (info.dropToGap) {
      let ar
      let i
      getMenus(menuTree, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        dropKey = null
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    } else {
      getMenus(menuTree, dropKey, (item) => {
        item.children = item.children || []
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj)
      })
    }
    onChangeTree(dragId, dragKey, dropKey)
  }

  const modalProps = {
    title: 'Edit / Delete Menu',
    visible: modalEdit.visible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    footer: [
      <Button type="primary" onClick={() => onEditItem(modalEdit.key)}>Edit</Button>
      // <Button type="danger" onClick={() => onDeleteItem(modalEdit.key)}>Delete</Button>
    ],
    onCancel () {
      onCancelSelect()
    }
  }

  return (
    <div>
      {modalEdit.visible && <Modal {...modalProps}>Do you want to edit {modalEdit.title}?</Modal>}
      <Card title="Menu" style={{ height: 500, overflowY: 'auto' }}>
        <Tree
          className="draggable-tree"
          draggable
          onDrop={onDrop}
        >
          {getMenus(menuTree)}
        </Tree>
      </Card>
    </div>
  )
}

List.propTypes = {
  menuTree: PropTypes.array,
  onChangeTree: PropTypes.func
}

export default List
