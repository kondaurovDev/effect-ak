export const docSectionNames = [
  "primary", "updating-messages", "stickets", "inline-mode",
  "payments", "telegram-passport", "games" 
] as const;

export type EntityNamespaceName = keyof typeof namespacesMap;

const navbarNamespaceSelector =
  (menuIndex: number) => `div.dev_side_nav ul > li:nth-child(${menuIndex}) li`

export const namespacesMap = {
  primary: {
    selectors: [
      navbarNamespaceSelector(6),
      navbarNamespaceSelector(7),
    ]
  },
  webhook: {
    selectors: [
      navbarNamespaceSelector(5),
    ]
  }
}