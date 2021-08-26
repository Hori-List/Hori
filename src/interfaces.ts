interface user {
  id: string;
  email: string;
  name: string;
}

interface list {
  id: string;
  name: string;
  items: string[];
}

interface invitation {
  id: string;
  listName: string;
  inviterName: string;
  inviterEmail: string
}

export {
  list, user, invitation
};
