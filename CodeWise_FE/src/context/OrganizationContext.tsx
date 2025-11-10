import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SelectedOrganization {
  id: string;
  name?: string;
}

interface OrganizationContextType {
  selectedOrganization: SelectedOrganization | null;
  selectOrganization: (organization: SelectedOrganization) => void;
  clearOrganization: () => void;
}

const STORAGE_KEY = "codewise-selected-organization";

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export const OrganizationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState<
    SelectedOrganization | null
  >(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }
      return JSON.parse(stored) as SelectedOrganization;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (selectedOrganization) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(selectedOrganization),
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedOrganization]);

  const selectOrganization = useCallback(
    (organization: SelectedOrganization) => {
      setSelectedOrganization(organization);
    },
    [],
  );

  const clearOrganization = useCallback(() => {
    setSelectedOrganization(null);
  }, []);

  const value = useMemo(
    () => ({ selectedOrganization, selectOrganization, clearOrganization }),
    [selectedOrganization, selectOrganization, clearOrganization],
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
};
