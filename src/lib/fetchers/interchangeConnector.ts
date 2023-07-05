import { getTLSAgent } from "@/lib/fetchers/sslAgent";
import { SubscriptionRequest } from "@/types/napcore/subscription";
import axios from "axios";
import { CertificateSignRequest } from "@/types/napcore/csr";

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

  return await axios.get(uri + uriPath, {
    params,
    headers,
    httpsAgent: tlsAgent,
  });
};

const postIXN: (
  actorCommonName: string,
  path: string,
  body: SubscriptionRequest | CertificateSignRequest | {}
) => Promise<any> = async (actorCommonName, path, body) => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${actorCommonName}${path}`;
  return await axios.post(uri + uriPath, body, {
    headers,
    httpsAgent: tlsAgent,
  });
};

const deleteIXN: (
  actorCommonName: string,
  path: string
) => Promise<any> = async (actorCommonName, path) => {
  const uri = process.env.INTERCHANGE_URI || "";
  const uriPath = `${actorCommonName}${path}`;
  return await axios.delete(uri + uriPath, {
    headers,
    httpsAgent: tlsAgent,
  });
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
  body?: SubscriptionRequest | CertificateSignRequest;
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
export const fetchNapcoreNetworkCapabilities: basicGetFunction = async (
  params
) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(
    actorCommonName,
    "/subscriptions/capabilities",
    selector
  );
};

export const fetchNapcoreSubscriptions: extendedGetFunction = async (
  params
) => {
  const { actorCommonName, selector = "", pathParam = "" } = params;
  return await fetchIXN(
    actorCommonName,
    `/subscriptions/${pathParam}`,
    selector
  );
};

export const addNapcoreSubscriptions: basicPostFunction = async (params) => {
  const { actorCommonName, body = {} } = params;
  return await postIXN(actorCommonName, "/subscriptions", body);
};

export const deleteNapcoreSubscriptions: basicDeleteFunction = async (
  params
) => {
  const { actorCommonName, pathParam } = params;
  return await deleteIXN(actorCommonName, `/subscriptions/${pathParam}`);
};

export const addNapcoreCertificates: basicPostFunction = async (params) => {
  const { actorCommonName, body = {} } = params;
  console.log("connector", params);
  return await postIXN(actorCommonName, "/x509/csr", body);
};

export const fetchNapcoreDeliveries: basicGetFunction = async (params: {
  actorCommonName: string;
  selector?: string;
}) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/deliveries", selector);
};

export const fetchNapcoreCapabilities: basicGetFunction = async (params) => {
  const { actorCommonName, selector = "" } = params;
  return await fetchIXN(actorCommonName, "/capabilities", selector);
};
