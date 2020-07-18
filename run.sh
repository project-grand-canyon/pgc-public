#!/bin/bash

start() {
  export REACT_APP_API_ENDPOINT=http://localhost:8080/api/
  yarn start
}

"$@"
