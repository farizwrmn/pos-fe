import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'

const Invoice = () => {
	return (
		<div className={styles.invoiceMini}>
			<div className={styles.center}>
				<div className={styles.title}>K3MART.ID</div>
				<div className={styles.subtitle}>ADAM MALIK</div>
			</div>
			<div className={styles.separator} />
			<div className={styles.left}>
				<div>Cashier : demo</div>
				<Row>
					<Col span={12}>
						<strong>Invoice</strong>
					</Col>
					<Col span={12} className={styles.right}>
						25 Dec 2019
					</Col>
				</Row>
				<div>
					<strong>#B1.19.12.25.00001</strong>
				</div>
			</div>
			<div className={styles.borderedSection}>
				<div className={styles.item}>
					<Row>
						<Col span={12} className={styles.left}>Cakes (Large) - 2017</Col>
					</Row>
					<Row>
						<Col span={12} className={styles.left}>1 x @100</Col>
						<Col span={12} className={styles.right}>100</Col>
					</Row>
				</div>
				<div className={styles.item}>
					<Row>
						<Col span={12} className={styles.left}>Bread (Regular) - 2012</Col>
					</Row>
					<Row>
						<Col span={12} className={styles.left}>1 x @100</Col>
						<Col span={12} className={styles.right}>100</Col>
					</Row>
				</div>
				<div className={styles.item}>
					<Row>
						<Col span={12} className={styles.left}>Pizza (Large) - 2007</Col>
					</Row>
					<Row>
						<Col span={12} className={styles.left}>1 x @100</Col>
						<Col span={12} className={styles.right}>50</Col>
					</Row>
				</div>
			</div>
			<div className={styles.amountSection}>
				<Row>
					<Col span={12} className={styles.right}>
						<span>
							<strong>
								Total (4 items)
							</strong>
							:Rp
						</span>
					</Col>
					<Col span={12} className={styles.right}>
						318
					</Col>
				</Row>
				<Row>
					<Col span={12} className={styles.right}><strong>Cash</strong>:Rp</Col>
					<Col span={12} className={styles.right}>
						318
					</Col>
				</Row>
			</div>
			<div className={styles.separator} />
			<div className={styles.reward}>
				<div>Redeem your reward at</div>
				<div>
					<strong>www.k3mart.id</strong>
				</div>
			</div>
			<div className={styles.amountSection}>
				<div>THANK YOU - SEE YOU AGAIN SOON!</div>
			</div>
		</div>
	)
}

export default Invoice
