
// config/index.tsx

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, base } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = '76bea6e0214af33cd917e82fac35cdc5'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, base]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig