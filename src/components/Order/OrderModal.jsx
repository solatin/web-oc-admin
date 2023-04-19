import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { formatCurrency, formatDate } from '../../utils';
import { getSrc } from '../Coupon';
import { STATUS } from './';
const OrderModal = ({ item, setSelectingOrder }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setSelectingOrder(false);
	};

	useEffect(() => {
		setIsModalOpen(!!item);
	}, [item]);

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
			render: (_, __, idx) => idx + 1
		},
		{
			title: 'Sản phẩm',
			dataIndex: 'productId',
			align: 'left',
			render: (product) => (
				<div className="d-flex gap-1" style={{ justifyContent: 'flex-start' }}>
					<img style={{ width: 56, height: 56, objectFit: 'cover' }} src={getSrc(product.imagePath)} />
					<b>{product.name}</b>
				</div>
			)
		},
		{
			title: 'Số lượng',
			dataIndex: 'amount'
		},
		{
			title: 'Giá',
			dataIndex: ['productId', 'price'],
			render: (text) => {
				console.log(text);
				return formatCurrency(text);
			}
		},
		{
			title: 'Tổng giá',
			dataIndex: 'total',
			render: (text, record) =>
				text === undefined ? (
					formatCurrency(record.productId.price * record.amount)
				) : (
					<div>
						<div style={{ textDecoration: 'line-through', color: 'gray' }}>
							{formatCurrency(record.productId.price * record.amount)}
						</div>
						<div>0₫</div>
					</div>
				)
		}
	];

	const productPrice = item
		? item.productInfos.reduce((prev, cur) => {
				return prev + cur.productId.price * cur.amount;
		  }, 0)
		: 0;
	return (
		item && (
			<>
				<Modal
					width={600}
					title={'Chi tiết đơn hàng'}
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={null}
				>
					<div className="d-flex column" style={{ alignItems: 'flex-start', gap: 12 }}>
						<div className="d-flex" style={{ justifyContent: 'space-between', width: '100%' }}>
							<span className="text-primary">{item.code}</span>
							<span className="text-primary">
								<span
									style={{
										padding: '4px 6px',
										color: 'white',
										fontWeight: 'bold',
										fontSize: 12,
										backgroundColor: STATUS[item.status].color,
										borderRadius: '5px'
									}}
								>
									{STATUS[item.status].text}
								</span>
							</span>
						</div>
						<div className="d-flex gap-1">
							<svg
								stroke="currentColor"
								fill="currentColor"
								stroke-width="0"
								viewBox="0 0 24 24"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g>
									<path fill="none" d="M0 0h24v24H0z"></path>
									<path d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zm-2 2H9v2H7V5H4v4h16V5h-3v2h-2V5zm5 6H4v8h16v-8zM6 14h2v2H6v-2zm4 0h8v2h-8v-2z"></path>
								</g>
							</svg>
							<b>Ngày đặt:</b>
							<span>{formatDate(item.time)} </span>
						</div>
						<div className="d-flex gap-1" style={{ alignItems: 'center' }}>
							<svg
								stroke="currentColor"
								fill="currentColor"
								stroke-width="0"
								viewBox="0 0 24 24"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g>
									<path fill="none" d="M0 0h24v24H0z"></path>
									<path d="M7.39 16.539a8 8 0 1 1 9.221 0l2.083 4.76a.5.5 0 0 1-.459.701H5.765a.5.5 0 0 1-.459-.7l2.083-4.761zm6.735-.693l1.332-.941a6 6 0 1 0-6.913 0l1.331.941L8.058 20h7.884l-1.817-4.154zM8.119 10.97l1.94-.485a2 2 0 0 0 3.882 0l1.94.485a4.002 4.002 0 0 1-7.762 0z"></path>
								</g>
							</svg>
							<b>Khách hàng:</b>
							<div>
								<span>{item.customerInfo.name}</span> - <span>{item.customerInfo.phone}</span>
							</div>
						</div>
						<div className="d-flex gap-1">
							<svg
								stroke="currentColor"
								fill="currentColor"
								stroke-width="0"
								viewBox="0 0 24 24"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g>
									<path fill="none" d="M0 0h24v24H0z"></path>
									<path d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79V20zm-2-1V9.978l-7-5.444-7 5.444V19h14zM7 15h10v2H7v-2z"></path>
								</g>
							</svg>
							<b>Địa chỉ:</b>
							<span>{item.customerInfo.address}</span>
						</div>
						<div className="d-flex gap-1">
							<b>Phương thức lấy hàng:</b>
							<span>{item.shippingMethod === 'atStore' ? 'Lấy tại cửa hàng' : 'Giao hàng'}</span>
						</div>
						<div style={{ width: '100%' }}>
							<div style={{ fontWeight: 'bold' }}>Danh sách món</div>
							<Table
								pagination={false}
								style={{ width: '100%' }}
								size="small"
								bordered
								columns={columns}
								dataSource={item.productInfos}
							/>
						</div>
						{item.coupon?.approved && (
							<>
								<div style={{ width: '100%' }}>
									<div style={{ fontWeight: 'bold' }}>Mã khuyến mãi</div>
									<div className="d-flex" style={{ justifyContent: 'flex-start' }}>
										{/* <b style={{ ...!item.coupon.approved ?{ textDecoration: 'line-through', color: 'gray'} : {}}}>{item.coupon.detail.code}</b> */}
										<b>{item.coupon?.detail?.code}:</b>
										{item.coupon?.detail?.description}
									</div>
								</div>
								{item.coupon?.detail?.type === 'giveAway' && (
									<div style={{ width: '100%' }}>
										<div style={{ fontWeight: 'bold' }}>Sản phẩm được tặng</div>
										<Table
											pagination={false}
											style={{ width: '100%' }}
											size="small"
											bordered
											columns={columns}
											dataSource={item.coupon?.detail?.giveAwayProductInfos.map((el) => ({ ...el, total: 0 }))}
										/>
									</div>
								)}
							</>
						)}
						<div className="d-flex column" style={{ alignItems: 'flex-end', width: '100%' }}>
							<div className="d-flex" style={{ justifyContent: 'space-between', width: '40%' }}>
								<b>Tiền hàng</b>
								<span>{formatCurrency(productPrice)}</span>
							</div>
							<div className="d-flex" style={{ justifyContent: 'space-between', width: '40%' }}>
								<b>Tiền ship</b>
								<span style={{ fontSize: 14 }}>
									{item.coupon?.detail?.type === 'freeShip' && item.coupon?.approved ? <i>Miễn phí</i> : 'Tuỳ tính'}
								</span>
							</div>
							{item.coupon?.detail?.type === 'discount' && item.coupon?.approved && (
								<div className="d-flex" style={{ justifyContent: 'space-between', width: '40%' }}>
									<b>Giảm khuyến mãi</b>
									<span style={{ fontSize: 14 }}>-{formatCurrency(item.coupon?.detail?.discountValue)}</span>
								</div>
							)}
							<div className="d-flex" style={{ justifyContent: 'space-between', width: '40%' }}>
								<b style={{ fontSize: 18 }}>Tổng tiền</b>
								<span style={{ fontSize: 14, color: '#ff4d4f', fontWeight: 'bold' }}>{formatCurrency(item.totalPrice)}</span>
							</div>
						</div>
					</div>
				</Modal>
			</>
		)
	);
};

OrderModal.propTypes = {};

export default OrderModal;
