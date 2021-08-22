interface user {
  email: string;
  name: string;
}

interface list {
  name: string;
  items: string[];
  members: string[];
  owner: string;
}

export {
  list, user,
};
