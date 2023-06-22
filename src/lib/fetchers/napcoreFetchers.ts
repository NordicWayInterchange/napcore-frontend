import { SubscriptionRequest } from "@/types/napcore/subscription";
import { CertificateSignRequest } from "@/types/napcore/csr";

const napCoreBaseUrl = process.env.NEXT_PUBLIC_NAPCORE_API_URI;

export const getSubscriptions = (
  actorCommonName: string,
  selector = "",
  pathParam = "",
  token: string
) => {
  if (pathParam.length > 0) {
    return fetch(
      `${napCoreBaseUrl}/${actorCommonName}/subscriptions/${pathParam}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  }
  return fetch(
    `${napCoreBaseUrl}/${actorCommonName}/subscriptions/?selector=${selector}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const createSubscription = (
  userName: string,
  body: SubscriptionRequest,
  token: string
) => {
  return fetch(`${napCoreBaseUrl}/${userName}/subscriptions`, {
    method: "post",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const createCertificate = (
  userName: string,
  body: CertificateSignRequest
) => {
  return fetch(`${napCoreBaseUrl}/${userName}/certificates`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const deleteSubscriptions = (
  actorCommonName: string,
  subscriptionId: string,
  token: string
) => {
  return fetch(
    `${napCoreBaseUrl}/${actorCommonName}/subscriptions/${subscriptionId}`,
    {
      method: "delete",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const getNetworkCapabilities = (
  userName: string,
  selector: string = "",
  token: string
) => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/network/capabilities?selector=${selector}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const getCapabilities = (
  userName: string,
  selector: string = "",
  token: string
) => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/capabilities?selector=${selector}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const getDeliveries = (
  userName: string,
  selector: string = "",
  token: string
) => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/capabilities?selector=${selector}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};
