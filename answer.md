When you have a browser-based application, the code is actually running in the browser.  Even if you have a container serving its code, it's actually being executed on the host system (or a remote system) and not in Docker.  The browser is the entity making the `fetch()` call, and the browser itself isn't running in a container.  That means the browser is trying to resolve the `backend` host name, and producing that error.

If you're running this all on the same system, the "easy" way around this is to separately publish a port for the backend service.  In the Compose file in the question, that's published on port 8002.  If you change the `fetch` call to

```javascript
fetch('http://localhost:8002/hello')
```

it will access the backend through this published port.

However: this setup only works if the browser and the containers are running on the same machine.  If you go to deploy the service somewhere else, this host name will need to be different too.  This call also triggers the rules on Cross-Origin Resource Sharing (CORS), and the backend service needs to be aware of this.

A better approach is to run an HTTP reverse proxy.  The proxy runs in a container, so it's "inside Docker" and can resolve the `backend` host name.  The browser uses a path-only URL to request the additional resource from the same host and port that served it, so it doesn't need to know any host name at all.  This also resolves the production-deployment and CORS issues.

This involves one additional container in the Compose setup

```yaml
version: '3.8'
services:
  frontend: { ... }
  backend: { ... }
  proxy:
    build: ./proxy
    ports: ['8000:80']
```

The container could be based on Nginx, requiring only adding its configuration

```sh
# proxy/Dockerfile
FROM nginx:1.25
COPY default.conf /etc/nginx/conf.d
```

The proxy configuration can be very simple.  Paths that begin with `/api/` get forwarded to the `backend` container; anything else gets forwarded to the `frontend`.

```none
server {
  listen 80;
  server_name localhost;
  
  location / {
    proxy_pass http://frontend:80/;
  }

  location /api/ {
    proxy_pass http://backend:5000/;
  }
}
```

Now in the Javascript code you can change the `fetch` call to

```javascript
fetch('/api/hello');
```

Note that the URL does not contain an `http` URL scheme or any host name or port; this path-only URL is resolved relative to the page's URL.

I've written a [small demo application](https://github.com/dmaze/docker-frontend-hostnames) showing these different call patterns and what URLs work in which contexts.
