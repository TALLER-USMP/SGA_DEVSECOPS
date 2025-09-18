import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const tenantId = process.env.AZURE_TENANT_ID!;
const audience = process.env.AZURE_AUDIENCE!;

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/keys`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

export function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ["RS256"],
        audience,
        issuer: `https://sts.windows.net/${tenantId}/`,
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      },
    );
  });
}
