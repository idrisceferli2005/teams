import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Input, Space, message } from "antd";
import { createTeam, deleteTeam, fetchTeams, updateTeam } from "../redux/features/teamsSlice";



function Teams() {
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector((state) => state.teams);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!name) return message.warning("Team name boş ola bilməz");
    await dispatch(createTeam({ name }));
    setName("");
  };

  const handleEdit = (team) => {
    setName(team.name);
    setEditId(team.id);
  };

  const handleUpdate = async () => {
    if (!name) return message.warning("Team name boş ola bilməz");
    await dispatch(updateTeam({ id: editId, team: { name } }));
    setEditId(null);
    setName("");
  };

  const handleDelete = async (id) => {
    await dispatch(deleteTeam(id));
  };

  const columns = [
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Teams</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {editId ? (
          <Button type="primary" onClick={handleUpdate}>
            Update
          </Button>
        ) : (
          <Button type="primary" onClick={handleAdd}>
            Add
          </Button>
        )}
      </Space>

      <Table
        dataSource={teams.map((t) => ({ ...t, key: t.id }))}
        columns={columns}
      />
    </div>
  );
}

export default Teams;