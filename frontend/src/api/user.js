import { get, put } from "./client";

export const getProfile = () => get("/api/users/profile");
export const updateRequirements = (data) => put("/api/users/requirements", data);
