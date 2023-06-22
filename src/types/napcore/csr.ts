export type CertificateSignRequest = {
  actorCommonName: string;
  csr: string;
};

export type CertificateSignResponse = {
  certificates: Array<string>;
};
