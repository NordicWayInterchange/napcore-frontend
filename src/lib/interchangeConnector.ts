import { getTLSAgent } from "@/lib/sslAgent";
import { SubscriptionRequest } from "@/types/napcore/subscription";
import axios from "axios";

const headers = {
  Accept: "application/json",
};
const tlsAgent = getTLSAgent();

// internals
const fetchIXN: (
  actorCommonName: string,
  path: string,
  selector?: string
) => Promise<any> = async (actorCommonName, path, selector = "") => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${actorCommonName}${path}`;
  const params: { selector?: string } = {};
  if (selector) {
    params.selector = selector;
  }
  const response = await axios.get(uri + uriPath, {
    params,
    headers,
    httpsAgent: tlsAgent,
  });
  return await response.data;
};

const postIXN: (
  actorCommonName: string,
  path: string,
  body: SubscriptionRequest
) => Promise<any> = async (actorCommonName, path, body) => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${actorCommonName}${path}`;
  const response = await axios.post(uri + uriPath, body, {
    headers,
    httpsAgent: tlsAgent,
  });
  return await response.data;
};

const deleteIXN: (
  actorCommonName: string,
  path: string
) => Promise<any> = async (actorCommonName, path) => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${actorCommonName}${path}`;
  const response = await axios.delete(uri + uriPath, {
    headers,
    httpsAgent: tlsAgent,
  });
  return await response.data;
};

// exported functions
export const fetchNetworkCapabilities = async (params: {
  actorCommonName: string;
  selector?: string;
}) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/network/capabilities", selector);
};

export const fetchCapabilities = async (params: {
  actorCommonName: string;
  selector?: string;
}) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/capabilities", selector);
};

export const fetchSubscriptions = async (params: {
  actorCommonName: string;
  pathParam?: string;
  selector?: string;
}) => {
  const { actorCommonName, selector = "", pathParam = "" } = params;
  return await fetchIXN(
    actorCommonName,
    `/subscriptions/${pathParam}`,
    selector
  );
};

export const fetchDeliveries = async (params: {
  actorCommonName: string;
  selector?: string;
}) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/deliveries", selector);
};

export const addSubscriptions = async (params: {
  actorCommonName: string;
  body: SubscriptionRequest;
}) => {
  const { actorCommonName, body } = params;
  return await postIXN(actorCommonName, "/subscriptions", body);
};

export const deleteSubscriptions = async (params: {
  actorCommonName: string;
  pathParam: string;
}) => {
  const { actorCommonName, pathParam } = params;
  return await deleteIXN(actorCommonName, `/subscriptions/${pathParam}`);
};
