import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import { useAuth } from '../hooks/useAuth';

interface PermissionState {
  permissions: string[];
}

type PermissionAction =
  | { type: 'SET_PERMISSIONS'; payload: string[] };

interface PermissionContextType extends PermissionState {
  hasPermission: (permission: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | null>(null);

function permissionReducer(state: PermissionState, action: PermissionAction): PermissionState {
  switch (action.type) {
    case 'SET_PERMISSIONS':
      return { permissions: action.payload };
    default:
      return state;
  }
}

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(permissionReducer, { permissions: [] });
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      const permissions = authService.getUserPermissions(user.id);
      dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
    } else {
      dispatch({ type: 'SET_PERMISSIONS', payload: [] });
    }
  }, [user]);

  const hasPermission = (permission: string) => {
    return state.permissions.includes(permission);
  };

  return (
    <PermissionContext.Provider value={{ ...state, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within PermissionProvider');
  }
  return context;
}
