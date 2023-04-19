import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Upload } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { ReactComponent as PlusOutlined } from '../../assets/plus.svg';
import { getSrc } from '.';

const getBase64 = (img, callback) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
};

const CouponModal = ({ onCreate, editingItem, setEditingItem, onUpdate, products }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState();

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setEditingItem(null);
		setFile(null);
		setImageUrl(null);
		form.resetFields();
	};
	const [form] = Form.useForm();

	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}
		setFile(file);
		getBase64(file, (url) => {
			setLoading(false);
			setImageUrl(url);
		});
		return false;
	};

	const uploadButton = (
		<div>
			{loading ? <Loading /> : <PlusOutlined />}
			<div
				style={{
					marginTop: 8
				}}
			>
				Upload
			</div>
		</div>
	);

	useEffect(() => {
		if (editingItem) {
			setIsModalOpen(true);
			form.setFieldsValue({
				...editingItem,
				giveAwayProductInfos: [
					{
						productId: editingItem.giveAwayProductInfos[0]?.productId?._id,
						amount: editingItem.giveAwayProductInfos[0]?.amount
					}
				]
			});
		}
	}, [editingItem]);

	console.log(editingItem);
	const onFinish = (values) => {
		const formData = new FormData();
		Object.entries(values).forEach(([key, val]) => {
			formData.append(key, val);
		});
		if (type === 'giveAway') {
			formData.append('giveAwayProductInfos.0.productId', values.giveAwayProductInfos[0].productId);
			formData.append('giveAwayProductInfos.0.amount', values.giveAwayProductInfos[0].amount);
		}
		formData.append('image', file);

		if (editingItem) onUpdate(formData, editingItem._id);
		else onCreate(formData);
		handleCancel();
	};

	const type = Form.useWatch('type', form);

	const productOptions = useMemo(() => products.map((p) => ({ label: p.name, value: p._id })), [products]);
	return (
		<>
			<Button type="primary" onClick={showModal}>
				Tạo coupon
			</Button>
			<Modal
				title={!editingItem ? 'Tạo coupon' : 'Sửa coupon'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
			>
				<Form
					form={form}
					labelCol={{ span: 24 }}
					onFinish={onFinish}
					initialValues={{
						name: '',
						priority: 0
					}}
				>
					<span>Hình coupon</span>
					<div className="d-flex gap-1" style={{ marginBottom: 12, marginTop: 4 }}>
						<div>
							<Upload
								accept="image/png, image/gif, image/jpeg"
								name="avatar"
								listType="picture-card"
								className="avatar-uploader"
								showUploadList={false}
								beforeUpload={beforeUpload}
								// onChange={handleChange}
							>
								{imageUrl || editingItem?.imagePath ? (
									<img
										src={imageUrl || getSrc(editingItem.imagePath)}
										alt="avatar"
										style={{
											objectFit: 'cover',
											width: '100%',
											height: '100%'
										}}
									/>
								) : (
									uploadButton
								)}
							</Upload>
						</div>
						<div
							className="d-flex column"
							style={{ height: '100%', padding: '6px', flex: 1, border: '1px dashed gray', borderRadius: '4px' }}
						>
							Ảnh PNG, JPEG, JPG không vượt quá 10Mb. Tỉ lệ khuyến nghị 1:1.
							{imageUrl && <b>Nhấn vào hình để thay đổi</b>}
						</div>
					</div>
					<Row gutter={8}>
						<Col span={12}>
							<Form.Item
								name="code"
								label="Mã khuyến mãi"
								required
								normalize={(val) => val?.toUpperCase()}
								rules={[{ required: true, message: 'Vui lòng nhập' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="type"
								label="Loại khuyến mãi"
								required
								rules={[{ required: true, message: 'Vui lòng nhập' }]}
							>
								<Select
									options={[
										{
											label: 'Giảm giá đơn hàng',
											value: 'discount'
										},
										{
											label: 'Tặng sản phẩm',
											value: 'giveAway'
										},
										{
											label: 'Giảm phí giao hàng',
											value: 'freeShip'
										}
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name="description"
								label="Mô tả"
								required
								rules={[{ required: true, message: 'Vui lòng nhập' }]}
							>
								<Input.TextArea />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								label="Giá trị đơn hàng tối thiểu"
								name="minimumPay"
								required
								trigger="onValueChange"
								rules={[{ required: true, message: 'Vui lòng nhập' }]}
								getValueFromEvent={(obj) => obj.floatValue}
							>
								<NumericFormat suffix="đ" customInput={Input} thousandSeparator="," />
							</Form.Item>
						</Col>
						{type === 'giveAway' && (
							<>
								<Col span={16}>
									<Form.Item label="Sản phẩm tặng" name={['giveAwayProductInfos', 0, 'productId']}>
										<Select options={productOptions} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label="Số lượng" name={['giveAwayProductInfos', 0, 'amount']}>
										<InputNumber />
									</Form.Item>
								</Col>
							</>
						)}
						{type === 'discount' && (
							<Col span={24}>
								<Form.Item
									label="Giá trị giảm"
									name="discountValue"
									trigger="onValueChange"
									getValueFromEvent={(obj) => obj.floatValue}
								>
									<NumericFormat suffix="đ" customInput={Input} thousandSeparator="," />
								</Form.Item>
							</Col>
						)}
						<Col span={24} className="d-flex" style={{ justifyContent: 'center' }}>
							<Button htmlType="submit" type="primary">
								{!editingItem ? 'Thêm coupon' : 'Cập nhật coupon'}
							</Button>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
};

CouponModal.propTypes = {};

export default CouponModal;
