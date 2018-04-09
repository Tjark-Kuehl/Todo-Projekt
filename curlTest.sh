#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{ "username": "test", "email": "ka@web.de" }' http://localhost:3000/test

read -p 'Press [Enter] key to continue...'