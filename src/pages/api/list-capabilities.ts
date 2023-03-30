import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Capabilities } from "../../types/capability";
import { getTLSAgent } from "../../lib/sslAgent";

const headers = {
  Accept: "application/json",
};
const fetchCapabilities: (userName: string) => Promise<Capabilities> = async (
  userName: string
) => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${userName}/network/capabilities`;
  const agent = getTLSAgent();
  const respons = await axios(uri + uriPath, { headers, httpsAgent: agent });

  return await respons.data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await fetchCapabilities("anna");
  res.status(200).json(data);
}
