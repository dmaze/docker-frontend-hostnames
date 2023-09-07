I'm building a containerized application where both the frontend and backend are served from the same Compose file:

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ['8001:80']
  backend:
    build: ./backend
    ports: ['8002:5000']
```

My frontend code needs to request a JSON resource from the backend.  Since both the frontend and the backend are in the same Compose file, I'd expect that Docker networking will allow me to use the backend's name as a host name, like

```javascript
fetch('http://backend:5000/hello')
```

When I make this call, though, I get a Javascript error

```none
TypeError: NetworkError when attempting to fetch resource.
```

and if I look in the browser debug tools on the "network" tab, I see an error code `NS_ERROR_UNKNOWN_HOST`.

Why doesn't the Docker service name work as a host name here?
