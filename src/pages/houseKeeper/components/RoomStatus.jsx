import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message } from 'antd';
import api from '../api/api';

function RoomStatus() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/housekeeping');
        setRooms(res.data);
      } catch (error) {
        message.error('Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);

  const handleStatusChange = async (roomId, status) => {
    try {
      await api.post('/housekeeping', {
        roomId,
        status,
        housekeeperName: localStorage.getItem('housekeeperName')
      });
      message.success('Status updated successfully');
      // Refresh data
      const res = await api.get('/housekeeping');
      setRooms(res.data);
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Room Number',
      dataIndex: 'room_number',
      key: 'room_number'
    },
    {
      title: 'Floor',
      dataIndex: 'floor',
      key: 'floor'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Status',
      dataIndex: 'cleaning_status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === 'Pending') color = 'volcano';
        if (status === 'In Progress') color = 'orange';
        if (status === 'Completed') color = 'green';
        return <Tag color={color}>{status || 'Not Started'}</Tag>;
      }
    },
    {
      title: 'Last Updated',
      dataIndex: 'last_updated',
      key: 'last_updated',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A'
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
            >
              Start Cleaning
            </Button>
          )}
          {record.cleaning_status === 'In Progress' && (
            <Button 
              type="primary" 
              onClick={() => handleStatusChange(record.id, 'Completed')}
            >
              Mark Complete
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Room Status</h1>
      <Table 
        columns={columns} 
        dataSource={rooms} 
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}

export default RoomStatus;