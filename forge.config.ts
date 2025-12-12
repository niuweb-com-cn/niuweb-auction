import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { PublisherGithub } from '@electron-forge/publisher-github'
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    //tmpdir: "../niuweb-auction-tmp",
    asar: true,
    ifnore: [
      /^\/src(\/|$)/,
      /^\/.git(\/|$)/,
      /^\/node_modules(\/|$)/,
      /\.map$/,
      /\.md$/
    ],
    name: "NiuAuction",
    icon: "./images/icon",
    win32metadata: {
      // Windows 元数据
    }
  },
  electronRebuildConfig: {
    parallel: false
  },
  rebuildConfig: {},
  makers: [
    new MakerDMG({
      name: "NiuAuction",
      icon: "./images/icon.icns",
      background: "./images/dmg.png"
    }),
    new MakerSquirrel({
      name: "NiuAuction",
      authors: "NiuWeb",
      exe: "NiuAuction.exe",
      setupExe: "NiuAuctionSetup.exe",
      noMsi: true,
      rcedit: "wine"
    }),
    new MakerZIP()
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: "niuweb-com-cn",
        name: "niuweb-auction"
      },
      prerelease: true,
      authToken: "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"
    })
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
    new AutoUnpackNativesPlugin({}),
  ],
};

export default config;
