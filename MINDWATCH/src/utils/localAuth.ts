
type User = {
  phone: string;
  password: string;
  createdAt: string;
};

// Initialize test account if not exists
const initializeTestAccount = () => {
  const users = getUsersFromStorage();
  if (!users.some(user => user.phone === "1234567890")) {
    const testUser: User = {
      phone: "1234567890",
      password: "test123",
      createdAt: new Date().toISOString(),
    };
    users.push(testUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Add some test journal entries
    const testEntries = [
      {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        entry: "Today I'm feeling much better after talking to friends.",
        rating: "8",
        flags: []
      },
      {
        id: crypto.randomUUID(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        entry: "I feel tired of feeling unwanted and helpless with friends surrounding me.",
        rating: "3",
        flags: ["emotional distress", "social isolation"]
      }
    ];
    localStorage.setItem('journal_entries', JSON.stringify(testEntries));
  }
};

export const registerUser = (phone: string, password: string): boolean => {
  const users = getUsersFromStorage();
  
  if (users.some(user => user.phone === phone)) {
    return false;
  }

  const newUser: User = {
    phone,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};

export const loginUser = (phone: string, password: string): boolean => {
  initializeTestAccount(); // Initialize test account on login attempt
  const users = getUsersFromStorage();
  return users.some(user => user.phone === phone && user.password === password);
};

const getUsersFromStorage = (): User[] => {
  const usersString = localStorage.getItem('users');
  return usersString ? JSON.parse(usersString) : [];
};
