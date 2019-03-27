# Dockerfile


# Construction de l'image

Pour construire l'image, il suffit de lancer la commande suivante à la racine du projet:
```
docker build -t debian-project -f docker/debian/Dockerfile .
```

Les éléments suivants peuvent être spécifiés:
- DNS (host et IP)
- Proxy

```
docker build -t debian-project --build-arg dnsIP=$dnsIP --build-arg dnsHost=$dnsHost --build-arg proxy=$proxy -f docker/debian/Dockerfile .
```

# Lancer l'application

Pour lancer l'application, il suffit d'utiliser la commande suivante:
```
docker run --name debian-project-server --rm -d -p 8080:8080 debian-project
```

## Mode DEBUG
```
docker run --name debian-project-server --rm -it -p 8080:8080 debian-project /bin/bash
```

## Pour développer en gardant le code source en local
```
docker run --name debian-project-server --rm -d -p 8080:8080 -v $src:/home/docker/app/src debian-project
```

## Pour débugger le mode développement avec les sources en local
```
docker run --name debian-project-server --rm -it -p 8080:8080 -v $src:/home/docker/app/src debian-project /bin/bash
```

# Lancer les tests

Les tests ont été écrits avec Mocha. Pour les lancer, on utilisera la commande suivante:
```
docker run --name debian-project-server --rm -v $src:/home/docker/app/src -v $test:/home/docker/app/test debian-project npm test
```

# Lancer eslint

Pour linter le code, il suffit de lancer la commande suivante:
```
docker run --name debian-road2-server --rm -v $src:/home/docker/app/src debian-road2 npm run lint
```

# Créer la documentation du code via jsdoc

Le code est documenté via des commentaires. Ces commentaires peuvent être plus ou moins structurés avec des tags. L'outil jsdoc permet de générer un site web à partir de ces commentaires et de ces tags.

Pour créer la documentation, il suffit de lancer la commande suivante:
```
docker run --name debian-road2-server --rm -v $doc:/home/docker/app/documentation/code debian-road2 npm run jsdoc
```

La documentation sera alors accessible dans `$doc`.
