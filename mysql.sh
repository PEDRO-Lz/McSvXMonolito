#!/bin/bash

CONTAINER_NAME=meu-mysql
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=usersdb
MYSQL_USER=user
MYSQL_PASSWORD=senha123
MYSQL_IMAGE=mysql:8

docker ps -a | grep $CONTAINER_NAME >/dev/null
if [ $? -eq 0 ]; then
  echo ">>> Container $CONTAINER_NAME já existe, removendo..."
  docker rm -f $CONTAINER_NAME
fi

echo ">>> Subindo o container $CONTAINER_NAME..."
docker run --name $CONTAINER_NAME \
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
  -e MYSQL_DATABASE=$MYSQL_DATABASE \
  -e MYSQL_USER=$MYSQL_USER \
  -e MYSQL_PASSWORD=$MYSQL_PASSWORD \
  -p 3306:3306 \
  -d $MYSQL_IMAGE

echo ">>> Aguardando o MySQL subir (isso pode levar até 20 segundos no primeiro uso)..."
sleep 20

echo ">>> Criando tabela users"
docker exec -i $CONTAINER_NAME mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE <<EOF
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
EOF

echo ">>> MySQL pronto! .env:"
echo "   host: localhost"
echo "   porta: 3306"
echo "   user: $MYSQL_USER"
echo "   senha: $MYSQL_PASSWORD"
echo "   banco: $MYSQL_DATABASE"
