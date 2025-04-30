import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import axiosClient from '../../axios';
import { Button, Divider, message, Popconfirm, Rate, Space, Switch, Tooltip, Typography, Spin } from 'antd';
import { ReactComponent as StarIcon } from '../../assets/star.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { ReactComponent as EditOutlined } from '../../assets/edit.svg';
import { formatCurrency } from '../../utils';
import CreateGroupLabelModal from './CreateGroupLabelModal';
import DishDrawer from './DishDrawer';
import { getSrc } from '../Coupon';

const Dish = (props) => {
	const [labelGroups, setLabelGroups] = useState([]);
	const [editingLabelGroup, setEditingLabelGroup] = useState(null);
	const [currentGroupLabelId, setCurrentGroupLabelId] = useState(null);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingOperations, setLoadingOperations] = useState({});

	const fetch = async () => {
		try {
			setLoading(true);
			const rs = await axiosClient.get('/group-labels');
			setLabelGroups(rs);
		} catch (e) {
			message.error('Lỗi');
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetch();
	}, []);

	const onCreateGroupLabel = async ({ name, priority = 0 }) => {
		try {
			setLoadingOperations(prev => ({ ...prev, createGroupLabel: true }));
			await axiosClient.post('/group-labels', { name, priority });
			await fetch();
			window.scrollTo(0, document.body.scrollHeight);
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		} finally {
			setLoadingOperations(prev => ({ ...prev, createGroupLabel: false }));
		}
	};

	const onUpdateGroupLabel = async (data, id) => {
		try {
			setLoadingOperations(prev => ({ ...prev, [`updateGroupLabel_${id}`]: true }));
			await axiosClient.put(`/group-labels/${id}`, data);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		} finally {
			setLoadingOperations(prev => ({ ...prev, [`updateGroupLabel_${id}`]: false }));
		}
	};

	const onDeleteGroupLabel = async (id) => {
		try {
			setLoadingOperations(prev => ({ ...prev, [`deleteGroupLabel_${id}`]: true }));
			await axiosClient.delete(`/group-labels/${id}`);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		} finally {
			setLoadingOperations(prev => ({ ...prev, [`deleteGroupLabel_${id}`]: false }));
		}
	};

	const onCreateProduct = async (formData) => {
		try {
			setLoadingOperations(prev => ({ ...prev, createProduct: true }));
			await axiosClient.post('/products', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		} finally {
			setLoadingOperations(prev => ({ ...prev, createProduct: false }));
		}
	};

	const onUpdateProduct = async (formData, id) => {
		try {
			setLoadingOperations(prev => ({ ...prev, [`updateProduct_${id}`]: true }));
			await axiosClient.put(`/products/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		} finally {
			setLoadingOperations(prev => ({ ...prev, [`updateProduct_${id}`]: false }));
		}
	};

	const onDeleteProduct = async (id) => {
		try {
			setLoadingOperations(prev => ({ ...prev, [`deleteProduct_${id}`]: true }));
			await axiosClient.delete(`/products/${id}`);
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		} finally {
			setLoadingOperations(prev => ({ ...prev, [`deleteProduct_${id}`]: false }));
		}
	};

	const onToggleDisabledProduct = async (id, disabled) => {
		try {
			setLoadingOperations(prev => ({ ...prev, [`toggleProduct_${id}`]: true }));
			await axiosClient.put(`/products/disabled/${id}`, { disabled });
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		} finally {
			setLoadingOperations(prev => ({ ...prev, [`toggleProduct_${id}`]: false }));
		}
	};

	return (
		<Spin spinning={loading}>
			<div>
				<div className="d-flex" style={{ justifyContent: 'space-between' }}>
					<Typography.Title level={2} style={{ marginBottom: 0 }}>
						Danh mục món
					</Typography.Title>
					<div style={{ marginLeft: 'auto' }}>
						<CreateGroupLabelModal
							onCreateGroupLabel={onCreateGroupLabel}
							editingLabelGroup={editingLabelGroup}
							setEditingLabelGroup={setEditingLabelGroup}
							onUpdateGroupLabel={onUpdateGroupLabel}
							loading={loadingOperations.createGroupLabel}
						/>
					</div>
				</div>

				<Divider />

				{labelGroups.map((labelGroup) => (
					<div key={labelGroup._id} className="d-flex column" style={{ alignItems: 'flex-start', marginBottom: 24 }}>
						<div className="d-flex">
							<span className="d-flex">
								<span style={{ marginBottom: 0, fontWeight: '600', fontSize: '20px' }}>{labelGroup.name}</span>
								<span style={{ marginLeft: 4, opacity: 0.7, fontSize: 12 }}>{`(Ưu tiên: ${labelGroup.priority})`}</span>
							</span>
							<Switch
								defaultChecked={!labelGroup.disabled}
								onChange={(checked) => onUpdateGroupLabel({ disabled: !checked }, labelGroup._id)}
								loading={loadingOperations[`updateGroupLabel_${labelGroup._id}`]}
							/>
							<Tooltip title="Chỉnh sửa">
								<Button
									type="text"
									icon={<EditOutlined />}
									onClick={() => {
										setEditingLabelGroup(labelGroup);
									}}
								></Button>
							</Tooltip>

							<Popconfirm
								title="Xoá danh mục?"
								onConfirm={(e) => {
									onDeleteGroupLabel(labelGroup._id);
								}}
								placement="left"
								okText="Xoá"
								cancelText="Huỷ"
							>
								<Tooltip title="Xoá">
									<Button 
										type="text" 
										icon={<DeleteIcon />}
										loading={loadingOperations[`deleteGroupLabel_${labelGroup._id}`]}
									></Button>
								</Tooltip>
							</Popconfirm>
						</div>
						<div style={{ width: '100%' }}>
							{labelGroup.productIds.map((product) => (
								<div key={product._id} className="d-flex dish" onClick={() => setCurrentProduct(product)}>
									<img src={getSrc(product.imagePath)} width={64} height={64} style={{ objectFit: 'cover' }} />
									<div className="d-flex" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
										<span style={{ fontWeight: 'bold' }}>{product.name}</span>
										<span className="d-flex gap-1 align-start" onClick={e => e.stopPropagation()}>
											<Rate 
												defaultValue={product.stars} 
												onChange={(stars) => onUpdateProduct({ stars }, product._id)} 
												disabled={loadingOperations[`updateProduct_${product._id}`]}
											/>
										</span>
									</div>
									<div className="d-flex column align-end" style={{ marginLeft: 'auto' }}>
										<span style={{ fontWeight: 'bold' }}>{formatCurrency(product.price)} {product.unit}</span>
										<div style={{ fontWeight: 'bold' }}>
											<span
												style={{ background: '#EF4444', padding: '4px', color: 'white', borderRadius: 2, marginRight: 4 }}
											>
												-{product.discountPercent || 0}%
											</span>
											<span style={{ textDecoration: 'line-through' }}>{formatCurrency(product.oldPrice)}</span>
										</div>
									</div>
									<span
										onClick={(e) => {
											e.stopPropagation();
										}}
									>
										<Switch
											defaultChecked={!product.disabled}
											onChange={(checked) => onToggleDisabledProduct(product._id, !checked)}
											loading={loadingOperations[`toggleProduct_${product._id}`]}
										/>
									</span>

									<Popconfirm
										title="Xoá sản phẩm?"
										onConfirm={(e) => {
											e.preventDefault();
											e.stopPropagation();
											onDeleteProduct(product._id);
										}}
										onCancel={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										placement="left"
										okText="Xoá"
										cancelText="Huỷ"
									>
										<Tooltip title="Xoá">
											<Button 
												icon={<DeleteIcon />} 
												type="text" 
												size="large" 
												style={{ marginLeft: 8 }}
												loading={loadingOperations[`deleteProduct_${product._id}`]}
											></Button>
										</Tooltip>
									</Popconfirm>
								</div>
							))}
						</div>
						<Button 
							onClick={() => setCurrentGroupLabelId(labelGroup._id)}
							loading={loadingOperations.createProduct}
						>
							Thêm món mới
						</Button>
					</div>
				))}
				<DishDrawer
					onUpdateProduct={onUpdateProduct}
					setProduct={setCurrentProduct}
					product={currentProduct}
					groupLabelId={currentGroupLabelId}
					setGroupLabelId={setCurrentGroupLabelId}
					onCreateProduct={onCreateProduct}
					loading={loadingOperations.createProduct || loadingOperations[`updateProduct_${currentProduct?._id}`]}
				/>
			</div>
		</Spin>
	);
};

Dish.propTypes = {};

export default Dish;
