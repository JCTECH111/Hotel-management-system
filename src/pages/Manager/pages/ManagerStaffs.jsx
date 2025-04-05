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

  const roles = ['employee', 'housekeeper'];
  const testStaffData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@hotel.com",
      pin: "hashed_password_1", // In a real app, this would be hashed
      role: "employee",
      createdAt: "2023-05-15T08:00:00Z"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@hotel.com",
      pin: "hashed_password_2",
      role: "housekeeper",
      createdAt: "2023-06-20T10:30:00Z"
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@hotel.com",
      pin: "hashed_password_3",
      role: "employee",
      createdAt: "2023-07-10T14:15:00Z"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@hotel.com",
      pin: "hashed_password_4",
      role: "housekeeper",
      createdAt: "2023-08-05T09:45:00Z"
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@hotel.com",
      pin: "hashed_password_5",
      role: "employee",
      createdAt: "2023-09-12T11:20:00Z"
    }
  ]
  // useEffect(() => {
  //   fetchStaffs();
  // }, []);

  // const fetchStaffs = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get('/api/staffs');
  //     setStaffs(response.data);
  //   } catch (error) {
  //     message.error('Failed to fetch staffs');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    // Simulate API call with test data
    setLoading(true);
    setTimeout(() => {
      setStaffs(testStaffData);
      setLoading(false);
    }, 500);
  }, []);
  

  const handleAddStaff = async (values) => {
    try {
      await axios.post('/api/staffs', values);
      message.success('Staff added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchStaffs();
    } catch (error) {
      message.error('Failed to add staff');
    }
  };

  const handleUpdateStaff = async (values) => {
    try {
      await axios.put(`/api/staffs/${currentStaff.id}`, values);
      message.success('Staff updated successfully');
      setIsEditModalVisible(false);
      editForm.resetFields();
      fetchStaffs();
    } catch (error) {
      message.error('Failed to update staff');
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await axios.delete(`/api/staffs/${id}`);
      message.success('Staff deleted successfully');
      // fetchStaffs();
    } catch (error) {
      message.error('Failed to delete staff', error);
    }
  };

  const filteredStaffs = staffs.filter(staff => 
    staff.name.toLowerCase().includes(searchText.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchText.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
              setCurrentStaff(record);
              editForm.setFieldsValue(record);
              setIsEditModalVisible(true);
            }}
          />
          <Button 
            type="danger" 
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