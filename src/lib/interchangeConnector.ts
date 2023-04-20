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

// types for handler functions
export type basicGetParams = {
  actorCommonName: string;
  selector?: string;
};
export type extendedGetParams = {
  actorCommonName: string;
  pathParam?: string;
  selector?: string;
};
export type basicPostParams = {
  actorCommonName: string;
  body: SubscriptionRequest;
};
export type basicDeleteParams = {
  actorCommonName: string;
  pathParam?: string;
};

export type basicGetFunction = (params: basicGetParams) => Promise<any>;
export type extendedGetFunction = (params: extendedGetParams) => Promise<any>;
export type basicPostFunction = (params: basicPostParams) => Promise<any>;
export type basicDeleteFunction = (params: basicDeleteParams) => Promise<any>;

// exported functions
export const fetchNetworkCapabilities: basicGetFunction = async (params) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/network/capabilities", selector);
};

export const fetchCapabilities: basicGetFunction = async (params) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/capabilities", selector);
};

export const fetchSubscriptions: extendedGetFunction = async (params) => {
  const { actorCommonName, selector = "", pathParam = "" } = params;
  return await fetchIXN(
    actorCommonName,
    `/subscriptions/${pathParam}`,
    selector
  );
};

export const fetchDeliveries: basicGetFunction = async (params: {
  actorCommonName: string;
  selector?: string;
}) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/deliveries", selector);
};

export const addSubscriptions: basicPostFunction = async (params) => {
  const { actorCommonName, body } = params;
  return await postIXN(actorCommonName, "/subscriptions", body);
};

export const deleteSubscriptions: basicDeleteFunction = async (params) => {
  const { actorCommonName, pathParam } = params;
  return await deleteIXN(actorCommonName, `/subscriptions/${pathParam}`);
};
