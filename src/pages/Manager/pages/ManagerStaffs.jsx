import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Modal, Button, Table, Form, Input, Select, message } from 'antd';

const { Option } = Select;

function ManagerStaffs() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const roles = ['employee', 'housekeeper', 'manager', 'guest']; // Added all roles from your DB enum

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/Staffs.php');
      if (response.data && response.data.status === 'success') {
        setStaffs(response.data.data || []);
      } else {
        message.error(response.data?.message || 'Failed to fetch staffs');
      }
    } catch (error) {
      console.error('Fetch staffs error:', error);
      message.error('Failed to fetch staffs. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (values) => {
    try {
      // Map form field names to database column names
      const staffData = {
        username: values.name,  // Your form uses 'name' but DB uses 'username'
        email: values.email,
        pin: values.pin,
        role: values.role
      };

      const response = await axios.post('http://localhost:8000/Staffs.php', staffData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        message.success('Staff added successfully');
        setIsModalVisible(false);
        form.resetFields();
        fetchStaffs();
      } else {
        message.error(response.data.message || 'Failed to add staff');
        if (response.data.errors) {
          response.data.errors.forEach(err => message.error(err));
        }
      }
    } catch (error) {
      console.error('Add staff error:', error);
      message.error(error.response?.data?.message || 'Failed to add staff');
    }
  };

  const handleUpdateStaff = async (values) => {
    try {
      // Map form field names to database column names
      const updateData = {
        username: values.name,  // Your form uses 'name' but DB uses 'username'
        email: values.email,
        role: values.role
      };

      // Only include password if it was provided
      if (values.pin) {
        updateData.pin = values.pin;
      }

      const response = await axios.put(
        `http://localhost:8000/Staffs.php?id=${currentStaff.id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Staff updated successfully');
        setIsEditModalVisible(false);
        editForm.resetFields();
        fetchStaffs();
      } else {
        message.error(response.data.message || 'Failed to update staff');
        if (response.data.errors) {
          response.data.errors.forEach(err => message.error(err));
        }
      }
    } catch (error) {
      console.error('Update staff error:', error);
      message.error(error.response?.data?.message || 'Failed to update staff');
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/Staffs.php?id=${id}`);
      if (response.data.status === 'success') {
        message.success('Staff deleted successfully');
        fetchStaffs();
      } else {
        message.error(response.data.message || 'Failed to delete staff');
      }
    } catch (error) {
      console.error('Delete staff error:', error);
      message.error(error.response?.data?.message || 'Failed to delete staff');
    }
  };

  const filteredStaffs = staffs.filter(staff => 
    staff.username.toLowerCase().includes(searchText.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchText.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            type="primary" 
            icon={<FaEdit />} 
            onClick={() => {
              // Map database fields to form fields
              setCurrentStaff(record);
              editForm.setFieldsValue({
                name: record.username,  // DB 'username' maps to form 'name'
                email: record.email,
                role: record.role
              });
              setIsEditModalVisible(true);
            }}
          />
          <Button 
            danger
            icon={<FaTrash />} 
            onClick={() => handleDeleteStaff(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button 
          type="primary" 
          icon={<FaPlus />}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Staff
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search staffs..."
          prefix={<FaSearch />}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-1/3"
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredStaffs} 
        loading={loading}
        rowKey="id"
        scroll={{ x: true }}
        className="shadow-md"
      />

      {/* Add Staff Modal */}
      <Modal
        title="Add New Staff"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddStaff}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="pin"
            label="Password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              {roles.map(role => (
                <Option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Staff
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        title="Edit Staff"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateStaff}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="pin"
            label="Password"
            rules={[{ required: false }]}
          >
            <Input.Password placeholder="Leave blank to keep current" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              {roles.map(role => (
                <Option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Staff
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManagerStaffs;