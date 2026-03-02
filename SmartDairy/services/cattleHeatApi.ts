import axios from "axios";

const API_BASE = "http://localhost:8000";

export const fetchCattleHeatData = async () => {
  const res = await axios.get(`${API_BASE}/cattle-heat/heat-stress`);
  return res.data;
};

export const getSprinklerStatus = async (cattleId: string) => {
  console.log("Fetching sprinkler status for:", cattleId);

  const res = await axios.get(`${API_BASE}/sprinkler/status/${cattleId}`);
  return res.data;
};

export const setAutoMode = async (cattleId: string) => {
  console.log("Switching to AUTO:", cattleId);

  const res = await axios.post(`${API_BASE}/sprinkler/auto`, {
    cattleId
  });

  return res.data;
};

export const setManualMode = async (cattleId: string, state: boolean) => {
  console.log("Switching to MANUAL:", cattleId, state);

  const res = await axios.post(`${API_BASE}/sprinkler/manual`, {
    cattleId,
    state
  });

  return res.data;
};