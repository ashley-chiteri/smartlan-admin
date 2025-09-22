// src/config.ts
const dev = {
  API_URL: "http://localhost:3000/api",
};

const prod = {
  API_URL: "https://api.smartlan.co.ke/api",
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;