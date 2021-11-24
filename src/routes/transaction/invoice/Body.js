import React from 'react'
import BodyItem from './BodyItem'
import Group from './Group'
import GroupShow from './GroupShow'
import styles from './index.less'

const Body = ({
  standardInvoice,
  dataPos = [],
  dataService = [],
  dataGroup = [],
  dataConsignment = []
}) => {
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
        {dataConsignment && dataConsignment.map((item, index) => {
          return (
            <BodyItem key={index} item={item} />
          )
        })}
        {standardInvoice && dataGroup && dataGroup.map((item, index) => {
          return (
            <Group key={index} item={item} />
          )
        })}
        {!standardInvoice && dataGroup && dataGroup.map((item, index) => {
          return (
            <GroupShow key={index} item={item} />
          )
        })}
      </div>
    </div>
  )
}

export default Body
