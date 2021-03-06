# Chameleon User Portal

## Dependencies

Most dependencies are specified in [requirements.txt](requirements.txt) and can
be installed via pip. External depdencies not available via pip:

- https://bitbucket.org/taccaci/pytas.git
- https://gitlab.labs.nic.cz/labs/python-rt.git

These are configured as git submodules and can be checked out using

```
git submodule update --recursive --init
```

If using the Docker container to run the portal, the submodules should be
checked out before building the image.

## Configuration

The following environment variables must be configured for `pytas`:

- `TAS_URL`: the full base URI for the TAS API, e.g. https://tas.tacc.utexas.edu/api
- `TAS_CLIENT_KEY`: the api key
- `TAS_CLIENT_SECRET`: the api secret

The following environment variables must be configured for `djangoRT`:

- `RT_HOST`: the hostname for the RT instance's REST endpoint, e.g., https://example.com/REST/1.0/
- `RT_USERNAME`: the RT account username
- `RT_PASSWORD`: the RT account password
- `RT_DEFAULT_QUEUE`: The default queue to which tickets will be submitted

If you omit the `DB_*` environment variables, Django will create and use
the default SQLite database. This is intended only for development/testing.
For production, provide the following environment variables to configure the
MySQL database connection:

- `DB_HOST`: The hostname to connect to, e.g., database.example.com
- `DB_PORT`: The MySQL port, e.g., 3306
- `DB_NAME`: The database name
- `DB_USER`: The username to authenticate
- `DB_PASSWORD`: The password to authenticate

## Running the portal

~~Use the docker container! See the `Dockerfile`~~ Use [Docker Compose](https://docs.docker.com/compose/)! The portal now uses the [reference-api](https://github.com/ChameleonCloud/reference-api) container for Resource Discovery. See [docker-compose.yml](docker-compose.yml) and [the reference-api repository](https://github.com/ChameleonCloud/reference-api).

#### Development

The docker-compose.yml included in this repo is setup for running the composition locally. First, clone the reference-api repository and build that image:

```bash
git clone git@github.com:ChameleonCloud/reference-api.git
cd reference-api
git submodule init && git submodule update
docker build -t referenceapi .
```

Copy the [chameleon_env.sample](chameleon_env.sample) file to `.chameleon_env` and configure the variables as necessary.

Finally, from the root portal projecct folder, run:

```bash
docker-compose up
```

If you need to (re)build the image, simply run:

```bash
docker-compose build
```

#### Production

There are a few additional requirements for running the composition in production. We want 
to run Django with uWSGI and Nginx in production 
(not with the [development server](https://docs.djangoproject.com/en/1.7/ref/django-admin/#django-admin-runserver)!) 
so the ports and command are different. We also need to mount in certificates and sensitive
configuration for SSL/TLS and the media directory for Django.

The Production `docker-compose.yml` would look more like the following:

```yaml
portal:
  image: mrhanlon/chameleon_portal:v#.#.#
  env_file:
    - /path/to/chameleon.env
  volumes:
    - /path/to/certs/certs0:/etc/ssl/chameleoncloud.org
    - /path/to/certs/certs1:/etc/ssl/www.chameleon.tacc.utexas.edu
    - /path/to/certs/certs2:/etc/ssl/api.chameleoncloud.org
    - /path/to/dhparams.pem:/etc/ssl/dhparams.pem
    - /path/to//media:/project/media
  ports:
    - 80:80
    - 443:443
  links:
    - referenceapi:referenceapi
  log_driver: syslog
  log_opt:
    syslog-tag: portal
referenceapi:
  image: referenceapi:latest
  ports:
    - 8000:8000
  log_driver: syslog
  log_opt:
    syslog-tag: referenceapi
```

## Release History

See the [Changelog](CHANGELOG.md).
