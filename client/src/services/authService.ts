import { useState, useEffect } from 'react';
import { users } from '@/data/mockData';

type UserRole = 'manager' | 'picker' | 'packer';

interface UserWithRole {
  id?: number;
  username: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export function useAuthService() {
  const authenticateUser = (username: string, password: string, role: UserRole): UserWithRole | null => {
    // In a real app, this would make an API call to authenticate
    const user = users.find(
      (u) => u.username === username && 
             u.password === password && 
             u.role === role
    );

    if (user) {
      // Don't return the password to the client
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as UserWithRole;
    }

    // For demo purposes, create a user if not found
    if (username && password) {
      // Generate a mock user based on the selected role
      const mockUser: UserWithRole = {
        username,
        name: role === 'manager' ? 'Alex Rodriguez' : 
             role === 'picker' ? 'Chris Wong' : 'Taylor Garcia',
        role,
        permissions: role === 'manager' 
          ? ['view', 'edit', 'approve', 'admin']
          : role === 'picker' 
            ? ['view', 'pick'] 
            : ['view', 'pack']
      };
      
      return mockUser;
    }

    return null;
  };

  return {
    authenticateUser
  };
}
