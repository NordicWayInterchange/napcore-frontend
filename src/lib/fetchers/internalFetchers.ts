export const createSubscription = (actorCommonName: string, body: Object) => {
  return fetch(`/api/${actorCommonName}/subscriptions`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const deleteSubscriptions = (
  actorCommonName: string,
  subscriptionId: string
) => {
  return fetch(`/api/${actorCommonName}/subscriptions/${subscriptionId}`, {
    method: "delete",
  });
};

export const createCertificate = (actorCommonName: string, csr: string) => {
  const csrRequest = {
    csr: csr,
  };
  return fetch(`/api/${actorCommonName}/x509/csr`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(csrRequest),
  });
};

export const createDelivery = (actorCommonName: string, body: Object) => {
  return fetch(`/api/${actorCommonName}/deliveries`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const deleteDeliveries = (
  actorCommonName: string,
  deliveryId: string
) => {
  return fetch(`/api/${actorCommonName}/deliveries/${deliveryId}`, {
    method: "delete",
  });
};

export const createPrivateChannel = (actorCommonName: string) => {
  return fetch(`/api/${actorCommonName}/privateChannels`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    }
  });
};

export const deletePrivateChannel = (
  actorCommonName: string,
  privateChannelId: string
) => {
  return fetch(`/api/${actorCommonName}/privateChannel/${privateChannelId}`, {
    method: "delete",
  });
};

export const createUserCapability = (actorCommonName: string, body: Object) => {
  return fetch(`/api/${actorCommonName}/capabilities`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const deleteUserCapability = (
  actorCommonName: string,
  capabilityId: string
) => {
  return fetch(`/api/${actorCommonName}/capabilities/${capabilityId}`, {
    method: "delete",
  });
};
