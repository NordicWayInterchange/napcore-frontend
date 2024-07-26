export const createSubscription = (
  actorCommonName: string,
  selector: string
) => {
  const subscriptionsRequest = {
    selector: selector,
  };
  return fetch(`/api/${actorCommonName}/subscriptions`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscriptionsRequest),
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

export const createDelivery = (
  actorCommonName: string,
  selector: string
) => {
  const deliveriesRequest = {
    selector: selector,
  };
  return fetch(`/api/${actorCommonName}/deliveries`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deliveriesRequest),
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

export const createUserCapability = (
  actorCommonName: string,
  data: any
) => {
  const capabilitiesRequest = {
    data
  };
 const json = '{\n' +
   '  "application": {\n' +
   '    "messageType": "IVIM",\n' +
   '    "protocolVersion": "string",\n' +
   '    "publisherId": "string",\n' +
   '    "publicationId": "100bbsa9",\n' +
   '    "originatingCountry": "string",\n' +
   '    "quadTree": [\n' +
   '      "111"\n' +
   '    ]\n' +
   '  },\n' +
   '  "metadata": {\n' +
   '    \n' +
   '  }\n' +
   '}';
  const obj = JSON.parse(json);
  return fetch(`/api/${actorCommonName}/capabilities`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(capabilitiesRequest),
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
