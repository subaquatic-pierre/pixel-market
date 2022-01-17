const navLinks = [
  { text: "Dashboard", link: "/", icon: "dashboard" },
  { text: "Wallet", link: "wallet", icon: "wallet" },
  { text: "Marketplace", link: "marketplace", icon: "market" },
  { text: "My Tokens", link: "tokens", icon: "token" },
];

export function useNavLinks() {
  return navLinks;
}

const adminLinks = [{ text: "Authors", link: "authors", icon: "author" }];

export function useAdminLinks() {
  return adminLinks;
}
