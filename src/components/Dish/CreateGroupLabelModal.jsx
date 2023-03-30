import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const CreateGroupLabelModal = ({ onCreateGroupLabel, editingLabelGroup, setEditingLabelGroup, onUpdateGroupLabel }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setEditingLabelGroup(null);
		form.resetFields();
	};
	const [form] = Form.useForm();

	useEffect(() => {
		if (editingLabelGroup) {
			setIsModalOpen(true);
			form.setFieldsValue(editingLabelGroup);
		}
	}, [editingLabelGroup]);

	const onFinish = (values) => {
		if (editingLabelGroup) onUpdateGroupLabel(values, editingLabelGroup._id);
		else onCreateGroupLabel(values);
		handleCancel();
	};
	return (
		<>
			<Button type='primary' onClick={showModal}>Thêm danh mục</Button>
			<Modal
				title={!editingLabelGroup ? 'Thêm danh mục' : 'Sửa danh mục'}
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
					<Row>
						<Col span={16}>
							<Form.Item
								name="name"
								label="Tên danh mục"
								required
								rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="priority" label="Độ ưu tiên">
								<InputNumber />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Button htmlType="submit" type="primary">
								{!editingLabelGroup ? 'Thêm danh mục' : 'Cập nhật danh mục'}
							</Button>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
};

CreateGroupLabelModal.propTypes = {};

export default CreateGroupLabelModal;
