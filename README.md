## basic architecture of containers

```
User => React frontend client => Express backend server
```

```
        | =>  PostgreSQL 
        |     store permanent list of indices
Express |     
        |
        | =>  Redis                               |     Worker 
              store indices & calculated values   | =>  watches Redis for new indices, pulls each new index, 
              as key-value pairs                  | <=  calculates new value then puts it back into Redis
```

```
        | =>  React 
Nginx   |              | =>  PostgreSQL
        | =>  Express  |                 
                       | =>  Redis  | =>  Worker
                                    | <=  
```

## Dockerfile build image & run container command

from within root directory, run to build image. note build context of relevant Dockerfile (./client, ./server, ./worker):
```bash
docker image build -t react:latest -f client/Dockerfile.dev ./client
docker image build -t express:latest -f server/Dockerfile.dev ./server
docker image build -t redis:latest -f worker/Dockerfile.dev ./worker
```

run container of specific images: 
```bash
docker container run -it react
docker container run -it express
docker container run -it redis
```

## docker-compose

build image
```bash
docker-compose --verbose build --no-cache
```

```bash
docker-compose up 
```

tear down containers and remove network. data volume persists as the volume mount point defined in docker-compose.yml for PostgreSQL establishes the volume to be used
```bash
docker-compose down 
```

TODO check if bodyParser.json needs to be used i/o express.json