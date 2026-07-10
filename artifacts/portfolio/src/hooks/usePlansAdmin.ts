import { useState, useEffect } from "react";

export interface PlanFolder {
  id: string;
  name: string;
  category: string;
}

export interface CustomPlan {
  id: string;
  folderId: string;
  category: string;
  url: string;
  title: string;
  file?: File;
}

// IndexedDB Helper for Plans
const initPlansDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BTPVisionPlansDB", 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("planFiles")) {
        db.createObjectStore("planFiles", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export function usePlansAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [folders, setFolders] = useState<PlanFolder[]>([]);
  const [customPlans, setCustomPlans] = useState<CustomPlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage & IndexedDB
  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(storedAdmin);

    const storedFolders = localStorage.getItem("planFolders");
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    } else {
      setFolders([]);
      localStorage.setItem("planFolders", JSON.stringify([]));
    }

    // Load media from IndexedDB
    initPlansDB().then(db => {
      const tx = db.transaction("planFiles", "readonly");
      const store = tx.objectStore("planFiles");
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result;
        // Recreate ObjectURLs for the loaded files
        const loadedPlans: CustomPlan[] = items.map((item: any) => ({
          id: item.id,
          folderId: item.folderId,
          category: item.category,
          url: URL.createObjectURL(item.file),
          title: item.title,
          file: item.file
        }));
        setCustomPlans(loadedPlans);
      };
    }).catch(e => console.error("IndexedDB load error", e));
  }, []);

  const login = (id: string, mdp: string) => {
    const normalize = (str: string) =>
      str.trim().toLowerCase().replace(/\s+/g, "").normalize("NFD").replace(/\p{Diacritic}/gu, "");
    if (normalize(id) === normalize("MatcheIbrahimCisse") && mdp.trim().toLowerCase() === "cisse7737") {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  const addFolder = (name: string, category: string) => {
    const newFolder = { id: Date.now().toString(), name, category };
    const updated = [...folders, newFolder];
    setFolders(updated);
    localStorage.setItem("planFolders", JSON.stringify(updated));
  };

  const deleteFolder = (id: string) => {
    const updated = folders.filter(f => f.id !== id);
    setFolders(updated);
    localStorage.setItem("planFolders", JSON.stringify(updated));
    
    // Delete associated files
    const plansToDelete = customPlans.filter(p => p.folderId === id);
    const updatedPlans = customPlans.filter(p => p.folderId !== id);
    setCustomPlans(updatedPlans);
    
    initPlansDB().then(db => {
      const tx = db.transaction("planFiles", "readwrite");
      const store = tx.objectStore("planFiles");
      plansToDelete.forEach(p => store.delete(p.id));
    });
  };

  const addPlan = async (folderId: string, category: string, file: File) => {
    try {
      const id = Date.now().toString();
      const objectUrl = URL.createObjectURL(file);
      
      const newItem: CustomPlan = {
        id,
        folderId,
        category,
        url: objectUrl,
        title: file.name,
        file
      };
      
      setCustomPlans(prev => [...prev, newItem]);

      // Save to IndexedDB
      const db = await initPlansDB();
      const tx = db.transaction("planFiles", "readwrite");
      const store = tx.objectStore("planFiles");
      store.put({ id, folderId, category, title: file.name, file });
      
    } catch (e) {
      console.warn("Processing error", e);
      setError("Erreur lors de la sauvegarde du fichier.");
    }
  };

  const deletePlan = async (id: string) => {
    setCustomPlans(prev => prev.filter(p => p.id !== id));
    try {
      const db = await initPlansDB();
      const tx = db.transaction("planFiles", "readwrite");
      const store = tx.objectStore("planFiles");
      store.delete(id);
    } catch(e) {
      console.error("Failed to delete from DB", e);
    }
  };

  return {
    isAdmin,
    login,
    logout,
    folders,
    addFolder,
    deleteFolder,
    customPlans,
    addPlan,
    deletePlan,
    error
  };
}
