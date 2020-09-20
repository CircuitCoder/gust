#!/bin/bash

export REACT_APP_WEB_REV=$(git rev-parse HEAD)

cd gust-gen
export REACT_APP_GEN_REV=$(git rev-parse HEAD)

cd ../gust-data
export REACT_APP_SRC_REV=$(git rev-parse HEAD)

echo "::set-env REACT_APP_WEB_REV::$REACT_APP_WEB_REV"
echo "::set-env REACT_APP_GEN_REV::$REACT_APP_GEN_REV"
echo "::set-env REACT_APP_SRC_REV::$REACT_APP_SRC_REV"

cd ..
