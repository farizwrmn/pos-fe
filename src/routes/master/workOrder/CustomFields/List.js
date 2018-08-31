import React from 'react'
import { Tree, Modal, Button } from 'antd'
import { arrayToTree } from 'utils'

const TreeNode = Tree.TreeNode

const List = ({ list, showEditModal, onEdit, modalEdit, deleteField }) => {
  const handleClickTree = (item) => {
    showEditModal(item)
  }

  const onDelete = () => {
    Modal.confirm({
      content: `Are you sure to delete ${modalEdit.item.fieldName}`,
      okText: 'Delete!',
      onOk () {
        deleteField(modalEdit.item.id)
      },
      onCancel () { }
    })
  }

  const modalProps = {
    title: 'Edit Field',
    visible: modalEdit.visible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    footer: [
      <div>
        <Button type="primary" onClick={() => onEdit(modalEdit.item)}>Edit</Button>
        <Button type="danger" onClick={() => onDelete()}>Delete</Button>
      </div>
    ],
    onCancel () {
      showEditModal()
    }
  }

  const menuTree = arrayToTree((list || []).filter(_ => _.id !== null), 'id', 'fieldParentId')
  const levelMap = {}
  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.fieldParentId) {
          levelMap[item.id] = item.fieldParentId
        }
        return (
          <TreeNode key={item.id} title={(<div onClick={() => handleClickTree(item)} value={item.id}>{`${item.sortingIndex}. ${item.fieldName}`}</div>)}>
            {getMenus(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode key={item.id} title={(<div onClick={() => handleClickTree(item)} value={item.id}>{`${item.sortingIndex}. ${item.fieldName}`}</div>)}>
          {(!menuTree.includes(item)) && item.name}
        </TreeNode>
      )
    })
  }

  const fields = getMenus(menuTree)

  return (
    <div style={{ margin: '0px', width: '100 %', overflowY: 'auto', height: '300px' }}>
      {modalEdit.visible && <Modal {...modalProps}>Do you want to edit {modalEdit.item.fieldName}?</Modal>}
      <Tree
        showLine
        defaultExpandAll
      >
        {fields}
      </Tree>
    </div>
  )
}

export default List
