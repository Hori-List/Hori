interface user {
  id: string;
  email: string;
  name: string;
}

interface list {
  id: string;
  name: string;
  items: string[];
  members: string[];
  owner: string;
}

export {
  list, user,
};
