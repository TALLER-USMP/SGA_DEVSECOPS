import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri:
    "https://login.microsoftonline.com/98201fef-d9f6-4e68-84f5-c2705074e342/discovery/keys",
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ["RS256"],
        audience: "api://3d7c6395-07ae-461b-82fb-4776ba1af653",
        issuer: "https://sts.windows.net/98201fef-d9f6-4e68-84f5-c2705074e342/",
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      },
    );
  });
}
