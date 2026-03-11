import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayers } from "../redux/features/playersSlice";
import { fetchTeams } from "../redux/features/teamsSlice";
import { Table, Select, Spin, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

export default function Player() {
  const dispatch = useDispatch();
  const { players, loading } = useSelector((state) => state.players);
  const { teams } = useSelector((state) => state.teams);

  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchTeams());
  }, [dispatch]);

  const filteredPlayers = selectedTeam
    ? players.filter((p) => p.teamId === selectedTeam)
    : players;

  // Table üçün kolonlar
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Players</Title>

      {/* Team Filter */}
      <Select
        placeholder="Select a team"
        value={selectedTeam || undefined}
        onChange={(value) => setSelectedTeam(value)}
        style={{ width: 200, marginBottom: 24 }}
        allowClear
      >
        {teams.map((team) => (
          <Option key={team.id} value={team.id}>
            {team.name}
          </Option>
        ))}
      </Select>

      {/* Players List */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredPlayers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
}