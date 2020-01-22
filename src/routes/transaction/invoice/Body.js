import React from 'react'
import BodyItem from './BodyItem'
import Group from './Group'
import styles from './index.less'

const Body = ({ dataPos = [], dataService = [], dataGroup = [] }) => {
  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos.filter(filtered => !filtered.bundlingId).map((item, index) => {
          return (
            <BodyItem key={index} item={item} />
          )
        })}
        {dataService && dataService.filter(filtered => !filtered.bundlingId).map((item, index) => {
          return (
            <BodyItem key={index} item={item} />
          )
        })}
        {dataGroup && dataGroup.map((item, index) => {
          return (
            <Group key={index} item={item} />
          )
        })}
      </div>
    </div>
  )
}

export default Body
