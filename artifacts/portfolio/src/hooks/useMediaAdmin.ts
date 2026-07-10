import { useState, useEffect } from "react";

export interface Folder {
  id: string;
  name: string;
  type: "photo" | "video" | "tous";
}

export interface CustomMedia {
  id: string;
  folderId: string;
  type: "photo" | "video";
  url: string;
  title: string;
}

// IndexedDB Helper
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BTPVisionMediaDB", 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("mediaFiles")) {
        db.createObjectStore("mediaFiles", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export function useMediaAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [customMedia, setCustomMedia] = useState<CustomMedia[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage & IndexedDB
  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(storedAdmin);

    const storedFolders = localStorage.getItem("mediaFolders");
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    } else {
      setFolders([]);
      localStorage.setItem("mediaFolders", JSON.stringify([]));
    }

    // Load media from IndexedDB
    initDB().then(db => {
      const tx = db.transaction("mediaFiles", "readonly");
      const store = tx.objectStore("mediaFiles");
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result;
        // Recreate ObjectURLs for the loaded files
        const loadedMedia: CustomMedia[] = items.map((item: any) => ({
          id: item.id,
          folderId: item.folderId,
          type: item.type,
          url: URL.createObjectURL(item.file),
          title: item.title
        }));
        setCustomMedia(loadedMedia);
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

  const addFolder = (name: string, type: "photo" | "video" | "tous" = "tous") => {
    const newFolder = { id: Date.now().toString(), name, type };
    const updated = [...folders, newFolder];
    setFolders(updated);
    localStorage.setItem("mediaFolders", JSON.stringify(updated));
  };

  const renameFolder = (id: string, newName: string) => {
    const updated = folders.map(f => f.id === id ? { ...f, name: newName } : f);
    setFolders(updated);
    localStorage.setItem("mediaFolders", JSON.stringify(updated));
  };

  const deleteFolder = (id: string) => {
    const updated = folders.filter(f => f.id !== id);
    setFolders(updated);
    localStorage.setItem("mediaFolders", JSON.stringify(updated));
    
    // Delete associated media
    const mediaToDelete = customMedia.filter(m => m.folderId === id);
    const updatedMedia = customMedia.filter(m => m.folderId !== id);
    setCustomMedia(updatedMedia);
    
    initDB().then(db => {
      const tx = db.transaction("mediaFiles", "readwrite");
      const store = tx.objectStore("mediaFiles");
      mediaToDelete.forEach(m => store.delete(m.id));
    });
  };

  const addMedia = async (folderId: string, type: "photo" | "video", file: File) => {
    try {
      const id = Date.now().toString();
      const objectUrl = URL.createObjectURL(file);
      
      const newItem: CustomMedia = {
        id,
        folderId,
        type,
        url: objectUrl,
        title: file.name,
      };
      
      setCustomMedia(prev => [...prev, newItem]);

      // Save to IndexedDB
      const db = await initDB();
      const tx = db.transaction("mediaFiles", "readwrite");
      const store = tx.objectStore("mediaFiles");
      store.put({ id, folderId, type, title: file.name, file });
      
    } catch (e) {
      console.warn("Processing error", e);
      setError("Erreur lors de la sauvegarde du fichier.");
    }
  };

  const deleteMedia = async (id: string) => {
    setCustomMedia(prev => prev.filter(m => m.id !== id));
    try {
      const db = await initDB();
      const tx = db.transaction("mediaFiles", "readwrite");
      const store = tx.objectStore("mediaFiles");
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
    renameFolder,
    deleteFolder,
    customMedia,
    addMedia,
    deleteMedia
  };
}
