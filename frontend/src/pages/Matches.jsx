import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams } from "../redux/features/teamsSlice";
import { createMatch, fetchMatches } from "../redux/features/matchesSlice";
import { Table, Select, InputNumber, Button, Spin, Typography, Row, Col } from "antd";

const { Option } = Select;
const { Title } = Typography;

export default function Matches() {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teams);
  const { matches, loading } = useSelector((state) => state.matches);

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchMatches());
  }, [dispatch]);

  const handleAddMatch = () => {
    if (!team1 || !team2 || team1 === team2) return alert("Select two different teams!");
    dispatch(createMatch({ team1Id: team1, team2Id: team2, score1, score2 }));
    setTeam1("");
    setTeam2("");
    setScore1(0);
    setScore2(0);
  };

  // League Table Calculation
  const leagueTable = teams.map((team) => {
    const playedMatches = matches.filter(
      (m) => m.team1Id === team.id || m.team2Id === team.id
    );

    let points = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    playedMatches.forEach((m) => {
      const isTeam1 = m.team1Id === team.id;
      const teamScore = isTeam1 ? m.score1 : m.score2;
      const oppScore = isTeam1 ? m.score2 : m.score1;

      goalsFor += teamScore;
      goalsAgainst += oppScore;

      if (teamScore > oppScore) points += 3;
      else if (teamScore === oppScore) points += 1;
    });

    return {
      key: team.id,
      teamName: team.name,
      played: playedMatches.length,
      goalsFor,
      goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
      points,
    };
  });

  leagueTable.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff);

  // Matches Table Columns
  const matchesColumns = [
    {
      title: "Team 1",
      dataIndex: "team1Name",
      key: "team1",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Team 2",
      dataIndex: "team2Name",
      key: "team2",
    },
  ];

  const matchesData = matches.map((m) => {
    const t1 = teams.find((t) => t.id === m.team1Id)?.name || "";
    const t2 = teams.find((t) => t.id === m.team2Id)?.name || "";
    return {
      key: m.id,
      team1Name: t1,
      team2Name: t2,
      score: `${m.score1} - ${m.score2}`,
    };
  });

  // League Table Columns
  const leagueColumns = [
    { title: "Team", dataIndex: "teamName", key: "team" },
    { title: "Played", dataIndex: "played", key: "played" },
    { title: "GF", dataIndex: "goalsFor", key: "gf" },
    { title: "GA", dataIndex: "goalsAgainst", key: "ga" },
    { title: "GD", dataIndex: "goalDiff", key: "gd" },
    { title: "Points", dataIndex: "points", key: "points" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Matches</Title>

      {/* Add Match Form */}
      <Row gutter={16} style={{ marginBottom: 24 }} align="middle">
        <Col>
          <Select
            placeholder="Team 1"
            value={team1 || undefined}
            onChange={setTeam1}
            style={{ width: 150 }}
          >
            {teams.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <InputNumber
            min={0}
            value={score1}
            onChange={(value) => setScore1(value)}
            placeholder="Score 1"
          />
        </Col>
        <Col>
          <span>vs</span>
        </Col>
        <Col>
          <InputNumber
            min={0}
            value={score2}
            onChange={(value) => setScore2(value)}
            placeholder="Score 2"
          />
        </Col>
        <Col>
          <Select
            placeholder="Team 2"
            value={team2 || undefined}
            onChange={setTeam2}
            style={{ width: 150 }}
          >
            {teams.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAddMatch}>
            Add Match
          </Button>
        </Col>
      </Row>

      {/* Matches List */}
      <Title level={4}>All Matches</Title>
      {loading ? <Spin size="large" /> : <Table dataSource={matchesData} columns={matchesColumns} pagination={{ pageSize: 5 }} />}

      {/* League Table */}
      <Title level={4} style={{ marginTop: 32 }}>
        League Table
      </Title>
      <Table dataSource={leagueTable} columns={leagueColumns} pagination={false} />
    </div>
  );
}