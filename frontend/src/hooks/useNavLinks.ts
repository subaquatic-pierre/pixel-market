const navLinks = [
  { text: "Dashboard", link: "/", icon: "dashboard" },
  { text: "Wallet", link: "wallet", icon: "wallet" },
  { text: "Marketplace", link: "marketplace", icon: "market" },
  { text: "Create Token", link: "create", icon: "create" },
  { text: "My Tokens", link: "tokens", icon: "token" },
  { text: "My Listings", link: "listings", icon: "listings" },
];

export function useNavLinks() {
  return navLinks;
}

const adminLinks = [
  { text: "Author Requests", link: "author-requests", icon: "author" },
];

export function useAdminLinks() {
  return adminLinks;
}
