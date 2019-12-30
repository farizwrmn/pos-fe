import React from 'react'
import BodyItem from './BodyItem'
import styles from './index.less'

const Body = ({ dataPos = [], dataService = [] }) => {
  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos.map((item, index) => {
          return (
            <BodyItem key={index} item={item} />
          )
        })}
        {dataService && dataService.map((item, index) => {
          return (
            <BodyItem key={index} item={item} />
          )
        })}
      </div>
    </div>
  )
}

export default Body
