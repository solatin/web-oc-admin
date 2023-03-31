import { Button, Col, Divider, message, Row, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { ReactComponent as EditOutlined } from '../../assets/edit.svg';
import axiosClient from '../../axios';
import CouponModal from './CouponModal';

export const getSrc = (path) => `http://103.57.223.162/${path}`;

const getTypeProps = (type) => {
	switch (type) {
		case 'freeShip':
			return {
				color: '#21C55D',
				text: 'GIẢM PHÍ GIAO HÀNG'
			};
		case 'giveAway':
			return {
				color: '#3B81F6',
				text: 'TẶNG SẢN PHẨM'
			};
		case 'discount':
			return {
				color: '#EF4444',
				text: 'GIẢM GIÁ ĐƠN HÀNG'
			};
	}
};
const Coupon = (props) => {
	const [coupons, setCoupons] = useState([]);
	const [editingCoupon, setEditingCoupon] = useState(null);
	const [products, setProducts] = useState([]);

	const fetch = async () => {
		try {
			const rs = await axiosClient.get('/coupons');
			setCoupons(rs);
		} catch (e) {
			message.error('Lỗi');
		}
	};
	useEffect(() => {
		fetch();
	}, []);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const rs = await axiosClient.get('/products');
				setProducts(rs);
			} catch (e) {
				message.error('Lỗi');
			}
		};
		fetchProducts();
	}, []);

	const onCreateCoupon = async (data) => {
		try {
			await axiosClient.post('/coupons', data);
			await fetch();
			window.scrollTo(0, document.body.scrollHeight);
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	const onUpdateCoupon = async (data, id) => {
		try {
			await axiosClient.put(`/coupons/${id}`, data);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	const onDeleteCoupon = async (id) => {
		try {
			await axiosClient.delete(`/coupons/${id}`);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	return (
		<div>
			<div className="d-flex" style={{ justifyContent: 'space-between' }}>
				<Typography.Title level={2} style={{ marginBottom: 0 }}>
					Khuyến mãi
				</Typography.Title>
				<div style={{ marginLeft: 'auto' }}>
					<CouponModal
						products={products}
						onCreate={onCreateCoupon}
						editingItem={editingCoupon}
						setEditingItem={setEditingCoupon}
						onUpdate={onUpdateCoupon}
					/>
				</div>
			</div>

			<Divider />
			<div style={{ border: '1px solid #D1D5DA', borderRadius: '1px' }}>
				<Row>
					<Col span={24}>
						<Row
							style={{
								backgroundColor: '#F9FAFB',
								padding: '10px 12px',
								fontWeight: 'bold',
								borderBottom: '1px solid #D1D5DA'
							}}
						>
							<Col span={12} className="d-flex" style={{ justifyContent: 'flex-start' }}>
								MÃ KHUYẾN MÃI
							</Col>
							<Col span={8}>LOẠI</Col>
							<Col span={4}></Col>
						</Row>
					</Col>
					{coupons.map((coupon) => (
						<Col
							key={coupon._id}
							className="coupon"
							span={24}
							style={{ padding: '10px 12px', background: 'white', borderBottom: '1px solid #D1D5DA' }}
							onDoubleClick={() => setEditingCoupon(coupon)}
						>
							<Row style={{}}>
								<Col span={12}>
									<div className="d-flex">
										<img src="/favi.jpeg" style={{ width: 40, height: 40, border: '1px solid #D1D5DA' }} />
										<div className="d-flex column" style={{ flex: 1, alignItems: 'flex-start' }}>
											<div style={{ marginBottom: 0 }}>
												<b>{coupon.code}</b>
											</div>
											<div style={{ textAlign: 'left' }}>{coupon.description}</div>
										</div>
									</div>
								</Col>
								<Col span={8} className="d-flex">
									<span
										style={{
											padding: '4px 6px',
											borderRadius: '5px',
											fontWeight: '600',
											fontSize: '12px',
											color: 'white',
											backgroundColor: getTypeProps(coupon.type).color
										}}
									>
										{getTypeProps(coupon.type).text}
									</span>
								</Col>
								<Col span={4} className="d-flex gap-1">
									<Tooltip title="Sửa">
										<Button onClick={() => setEditingCoupon(coupon)} type="text" icon={<EditOutlined />}></Button>
									</Tooltip>
									<Tooltip title="Xoá">
										<Button onClick={() => onDeleteCoupon(coupon._id)} type="text" icon={<DeleteIcon />}></Button>
									</Tooltip>
								</Col>
							</Row>
						</Col>
					))}
				</Row>
			</div>
			{/* 
			<DishDrawer
				onUpdateProduct={onUpdateProduct}
				setProduct={setCurrentProduct}
				product={currentProduct}
				groupLabelId={currentGroupLabelId}
				setGroupLabelId={setCurrentGroupLabelId}
				onCreateProduct={onCreateProduct}
			/> */}
		</div>
	);
};

Coupon.propTypes = {};

export default Coupon;
