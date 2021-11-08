import React from 'react'
import BodyItem from './BodyItem'
import Group from './Group'
import GroupShow from './GroupShow'
import styles from './index.less'

const Body = ({
  user,
  standardInvoice,
  dataPos = [],
  dataService = [],
  dataGroup = [],
  dataConsignment = []
}) => {
  let role = false
  if (user && user.permissions && user.permissions.role) {
    role = user.permissions.role === 'SPR' || user.permissions.role === 'OWN' || user.permissions.role === 'ADM'
  }
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
        {!standardInvoice && role && dataGroup ? dataGroup.map((item, index) => {
          return (
            <GroupShow key={index} item={item} />
          )
        }) : (!standardInvoice && role && dataGroup ? dataGroup.map((item, index) => {
          return (
            <Group key={index} item={item} />
          )
        }) : null)}
      </div>
    </div>
  )
}

export default Body
