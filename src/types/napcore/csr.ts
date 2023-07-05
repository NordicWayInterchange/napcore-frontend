export type CertificateSignRequest = {
  csr: string;
};

export type CertificateSignResponse = {
  certificates: Array<string>;
};
