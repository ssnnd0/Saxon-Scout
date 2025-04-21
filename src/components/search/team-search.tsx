// src/components/search/team-search.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SearchBar } from "./search-bar";
import { TeamData } from "@/lib/api/types";
import api from "@/lib/api/axios";
import { useApi } from "@/context/api-context";

export const TeamSearch: React.FC = () => {
  const [teams, setTeams] = React.useState<TeamData[]>([]);
  const { setLoading, setError } = useApi();

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await api.get<TeamData[]>(`/teams/search?q=${query}`);
      setTeams(response.data);
    } catch (error) {
      setError(error as ErrorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} placeholder="Search teams..." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>Team {team.number}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{team.name}</p>
              <p className="text-sm text-muted-foreground">{team.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};