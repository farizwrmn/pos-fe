// import React from 'react'
// import { Editor } from 'react-draft-wysiwyg'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import styles from './Editor.less'


// const DraftEditor = (props) => {
//   return (<Editor toolbarClassName={styles.toolbar} wrapperClassName={styles.wrapper} editorClassName="editor ant-input" {...props} />)
// }

// export default DraftEditor
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const DraftEditor = (props) => {
  return (<ReactQuill className="editor ant-input" {...props} />)
}

export default DraftEditor
