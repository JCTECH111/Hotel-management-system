import React, { useState, useEffect, useContext } from 'react';
import { Table, Tag, Button, Space, message, Spin } from 'antd';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

function RoomStatus() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsRes = await axios.get('http://localhost:8000/housekeeping.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setRooms(roomsRes.data);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [token]);

  const handleStatusChange = async (roomId, status) => {
    try {
      setUpdating(true);
      await axios.post(
        'http://localhost:8000/update_room.php',
        {
          roomId,
          status,
          housekeeperName: localStorage.getItem('housekeeperName')
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Optimistic UI update
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId 
            ? { ...room, cleaning_status: status, last_updated: new Date().toISOString() } 
            : room
        )
      );
      
      message.success(`Room status updated to ${status}`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update status');
      // Revert optimistic update if needed
      fetchRooms();
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      title: 'Room Number',
      dataIndex: 'room_number',
      key: 'room_number',
      sorter: (a, b) => a.room_number.localeCompare(b.room_number),
    },
    {
      title: 'Floor',
      dataIndex: 'floor',
      key: 'floor',
      sorter: (a, b) => a.floor - b.floor,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Standard', value: 'Standard' },
        { text: 'Deluxe', value: 'Deluxe' },
        { text: 'Suite', value: 'Suite' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Status',
      dataIndex: 'cleaning_status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value, record) => record.cleaning_status === value,
      render: (status) => {
        const statusMap = {
          'Pending': { color: 'volcano', text: 'Pending' },
          'In Progress': { color: 'orange', text: 'In Progress' },
          'Completed': { color: 'green', text: 'Completed' },
          undefined: { color: 'default', text: 'Not Started' }
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'last_updated',
      key: 'last_updated',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A',
      sorter: (a, b) => new Date(a.last_updated) - new Date(b.last_updated),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {(!record.cleaning_status || record.cleaning_status === 'Pending') && (
            <Button 
              type="primary" 
              onClick={() => handleStatusChange(record.id, 'In Progress')}
              loading={updating}
            >
              Start Cleaning
            </Button>
          )}
          {record.cleaning_status === 'In Progress' && (
            <Button 
              type="primary" 
              onClick={() => handleStatusChange(record.id, 'Completed')}
              loading={updating}
            >
              Mark Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Room Status</h1>
      <Table 
        columns={columns} 
        dataSource={rooms} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        bordered
      />
    </div>
  );
}

export default RoomStatus;