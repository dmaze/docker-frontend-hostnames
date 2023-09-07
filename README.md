# Docker Browser Fetch Demo App

This is a quick demo app showing different URLs calling from a browser application into a backend service, all running in a Docker Compose setup.

Since this is all served from Docker, [Networking in Compose](https://docs.docker.com/compose/networking/) would seem to suggest that you can call from the front-end container to the back-end container using the Compose service name `backend` as a host name.  Click the `GET backend` button in the browser application and this doesn't work; why not?

## Running the app

Check out this repository

```sh
git clone https://github.com/dmaze/docker-frontend-hostnames
```

and fire it up

```sh
docker-compose up -d --build
```

Point your browser at http://localhost:8000.  There are three buttons:

1. "GET backend" makes an HTTP request to `http://backend/hello` using the Compose service name;
2. "GET localhost" makes an HTTP request to `http://localhost:8002/hello` using the backend's published `ports:`; and
3. "GET api" makes an HTTP request to `/api/hello` using a path-only URL.

## What's going on?

There's a difference between network calls "inside Docker" between containers, and calls that originate from "outside" Docker.

The typical example of an "inside Docker" call is a call from a backend service to its database.  This example doesn't include a database, but you could imagine a typical Compose setup

```yaml
services:
  database:
    image: postgres:14
  app:
    environment:
      PGHOST: database
```

```none
. . . . . . . . . . . . . .
. Docker                  .
. +-----+     +----------+.
. | app | --> | database |.
. +-----+     +----------+.
. . . . . . . . . . . . . .
```

When you have a browser-based application, though, the code is actually running in the browser.  Even if you have a container serving its code, it's actually being executed on the host system (or a remote system) and not in Docker.

```none
+---------+          . . . . . . . . .
| Browser |          . Docker        .
|         |  JS/CSS  . +-----------+ .
|         | <--------- | frontend  | .
|         |          . +-----------+ .
|         |          .               .
|         |    GET   . +-----------+ .
|         | ---------> |  backend  | .
|         |          . +-----------+ .
+---------+          . . . . . . . . .
```

If you're running this all on the same system, the "easy" way around this is to separately publish a port for the backend service.  In this example, that's published on port 8002.  The "GET localhost" button makes a call to `http://localhost:8002/hello` to directly access the backend that way.  However, this URL will be different if the system is actually be deployed somewhere, and the backend service needs to support Cross-Origin Resource Sharing (CORS).

The "hard" way to do this is to run an HTTP reverse proxy.  The browser talks only to this proxy, but it does path-based routing to target one container or the other.

```none
+---------+    . . . . . . . . . . . . . . . . .
| Browser |    . Docker                        .
|         |    .                 +-----------+ .
|         |    .           /     | frontend  | .
|         |    . +-------+ ----> +-----------+ .
|         | ---> | proxy |                   .
|         |    . +-------+ ----> +-----------+ .
|         |    .           /api  | backend   | .
|         |    .                 +-----------+ .
+---------+    . . . . . . . . . . . . . . . . .
```

This involves one additional container; the example in this repository uses an Nginx container with a minimal additional configuration.  In the application, the "GET /api" button makes a call to `/api/hello`, including only a path in the URL.  This makes it relative to the current host and port, wherever that may be.  It is not a cross-origin call so there are not CORS concerns.  You do not need to know the host, or port, or whatever further reverse proxies or CDNs may be in use.

## Some experiments

If you have a local checkout of the repository, there are several things you can experiment with.

**Skip the proxy:** Try accessing the application via `http://localhost:8001` to connect directly to the frontend container.  The "GET localhost" path directly accessing the backend container's published port will still work.  "GET /api" will try to fetch this path from the frontend container, and return an HTTP 404 error; if you were running a dev server you could set this up to proxy to the backend container.

**Remove ports:** In the last diagram, notice that the browser does not directly call the frontend or backend services.  Try removing their `ports:` from the Compose configuration.  The "GET /api" path will still work.

**Disable CORS:** The backend is a minimal Flask application with an open CORS setup.  Remove the two lines that enable CORS.  The same-domain "GET /api" path will still work, but calling a different port will not.
