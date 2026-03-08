import { api } from "./../hooks/api";

export const fetchCattleHeatData = async () => {
     const res = await api.get("/cattle-heat/heat-stress");

  return res.data;
};

export const getSprinklerStatus = async (cattleId: string) => {
  console.log("Fetching sprinkler status for:", cattleId);

  const res = await api.get(`/sprinkler/status/${cattleId}`);
  return res.data;
};

export const setAutoMode = async (cattleId: string) => {
  console.log("Switching to AUTO:", cattleId);

  const res = await api.post("/sprinkler/auto", {
    cattleId,
  });

  return res.data;
};

export const setManualMode = async (cattleId: string, state: boolean) => {
  console.log("Switching to MANUAL:", cattleId, state);

  const res = await api.post("/sprinkler/manual", {
    cattleId,
    state,
  });

  return res.data;
};