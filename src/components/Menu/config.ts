import { MenuEntry } from '@onidex-libs/uikit'

const config: MenuEntry[] = [
  {
    label: "Charts",
    icon: "InfoIcon",
    href: "/",
  },
  {
    label: "Swap",
    icon: 'SyncAltIcon',
    href: '/swap'
  },
  {
    label: "Stake",
    icon: "PoolIcon",
    href: "/polystake",
  },
  {
    label: "DEXplorer",
    icon: "FarmIcon",
    href: "/pools",
  },
  {
    label: "PriceBOT",
    icon: "NftIcon",
    href: "/price-bot",
  },
  // {
  //   label: "ProjEX",
  //   icon: "NftIcon",
  //   href: "/project",
  // }
]

export const socials = [
  {
    label: "Telegram",
    icon: "TelegramIcon",
    href: 'https://t.me/mybakerytools'
  },
  {
    label: "Twitter",
    icon: "TwitterIcon",
    href: "https://twitter.com/BakeryTools",
  }
];

export default config
