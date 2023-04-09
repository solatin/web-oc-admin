import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';

const CouponModal = ({ onCreate, editingItem, setEditingItem, onUpdate, products }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setEditingItem(null);
		form.resetFields();
	};
	const [form] = Form.useForm();

	useEffect(() => {
		if (editingItem) {
			setIsModalOpen(true);
			form.setFieldsValue(editingItem);
		}
	}, [editingItem]);

	const onFinish = (values) => {
		console.log(values)
		if (editingItem) onUpdate(values, editingItem._id);
		else onCreate(values);
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
								trigger="onValueChange"
								getValueFromEvent={(obj) => obj.floatValue}
							>
								<NumericFormat suffix="đ" customInput={Input} thousandSeparator="," />
							</Form.Item>
						</Col>
						{type === 'giveAway' && (
							<>
								<Col span={16}>
									<Form.Item
										label="Sản phẩm tặng"
										name={['giveAwayProductInfos', 0, 'productId']}
									>
										<Select options={productOptions} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Số lượng"
										name={['giveAwayProductInfos', 0, 'amount']}
									>
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
						<Col span={24} className="d-flex" style={{justifyContent: 'center'}}>
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
