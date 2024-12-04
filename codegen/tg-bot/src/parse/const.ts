export const array_of_type = "Array of ";

export const is_returned_regex = /\w+(?= is returned)/g
export const returns_regex = /(?<=^Returns )\w+/g

export const method_type_name_regex = /^\w+$/

export const docSectionNames = [
  "primary", "updating-messages", "stickets", "inline-mode",
  "payments", "telegram-passport", "games" 
] as const;

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