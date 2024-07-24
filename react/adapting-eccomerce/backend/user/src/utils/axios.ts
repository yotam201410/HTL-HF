import axios from "axios";

export const gateway = axios.create({baseURL:process.env.Gateway});