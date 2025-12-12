#/usr/bin/bash

export TMPDIR=../niuweb-auction-tmp
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

npm run make --platform=darwin --arch=arm64
npm run make --platform=darwin --arch=x64