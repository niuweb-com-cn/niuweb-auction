#/usr/bin/bash

export TMPDIR=../niuweb-auction-tmp
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

systemd-run --scope -p CPUQuota=50% -p MemoryMax=2G npm run make --platform=win32 --arch=arm64
systemd-run --scope -p CPUQuota=50% -p MemoryMax=2G npm run make --platform=win32 --arch=ia32
systemd-run --scope -p CPUQuota=50% -p MemoryMax=2G npm run make --platform=win32 --arch=x64