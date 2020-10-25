![Publish to Docker](https://github.com/SuveshBaskar/kubernetes-dashboard-proxy/workflows/Publish%20to%20Docker/badge.svg?branch=v1.0.8&event=create)

# Kubernetes Dashboard Proxy

Kubernetes Dashboard comes with a good UI but the users have to manually either use the token or the config file for getting access. This project leverages the use of Google Oauth, and now you can maintain who can do what in the Kubernetes UI without sharing the secrets/Token with anyone

### API DESIGN DOCUMENT
PROXY
/ => KUBERNETES DASHBOARD => ONLY AUTH ACCESS

IF NOT AUTHENTICATED 
/ => /login => GOOGLE AUTH => /

PROTECTED ROUTES
/
/logout

NOT PROTECTED ROUTES
GET /login        - REDIRECT TO GOOGLE LOGIN
GET /ping         - RETURNS PONG - application/txt
GET /health       - RETURNS JSON {status: "OPERATIONAL", message:"SERVER OK"}
GET /auth/google  - GOOGLE OAUTH CALLBACK
