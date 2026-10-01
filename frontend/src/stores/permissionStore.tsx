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
    let cancelled = false;
    if (user?.id) {
      // Effective permissions are resolved server-side from the user's roles.
      authService.getMyPermissions().then((permissions) => {
        if (!cancelled) dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
      });
    } else {
      dispatch({ type: 'SET_PERMISSIONS', payload: [] });
    }
    return () => {
      cancelled = true;
    };
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
