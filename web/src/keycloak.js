import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "disaster-realm",
  clientId: "disaster-web",
});

export default keycloak;