interface INavLink {
  text: string;
  link: string;
  icon: string;
}

const navLinks: INavLink[] = [
  { text: "Dashboard", link: "/", icon: "dashboard" },
  { text: "Wallet", link: "wallet", icon: "wallet" },
  { text: "Marketplace", link: "marketplace", icon: "market" },
  { text: "My Tokens", link: "tokens", icon: "token" },
];

export function useNavLinks() {
  return navLinks;
}

const adminLinks: INavLink[] = [
  { text: "Authors", link: "authors", icon: "author" },
  { text: "Listings", link: "listings", icon: "listings" },
  { text: "Admins", link: "admins", icon: "admins" },
];

export function useAdminLinks() {
  return adminLinks;
}
