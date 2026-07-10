import { useState, useEffect } from "react";

export interface CustomProject {
  id: string;
  name: string;
  description: string;
  type: string;
  surface: string | null;
  budget: string | null;
  location: string | null;
  date: string | null;
  status: string;
  coverImage: string | null;
  attachmentName: string | null;
  attachmentUrl: string | null;
  createdAt: string;
  isCustom: true;
}

// IndexedDB Helper for Projects
const DB_VERSION = 2; // bump version to add "attachments" store
const initProjectsDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BTPVisionProjectsDB", DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("projects")) {
        db.createObjectStore("projects", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("coverImages")) {
        db.createObjectStore("coverImages", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("attachments")) {
        db.createObjectStore("attachments", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export function useProjectsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([]);
  const [coverImageUrls, setCoverImageUrls] = useState<Record<string, string>>({});
  const [attachmentUrls, setAttachmentUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(storedAdmin);

    // Load custom projects from IndexedDB
    initProjectsDB().then(db => {
      const stores = ["projects", "coverImages", "attachments"];
      const tx = db.transaction(stores, "readonly");
      const projectsStore = tx.objectStore("projects");
      const imagesStore = tx.objectStore("coverImages");
      const attachmentsStore = tx.objectStore("attachments");

      const projectsReq = projectsStore.getAll();
      const imagesReq = imagesStore.getAll();
      const attachmentsReq = attachmentsStore.getAll();

      projectsReq.onsuccess = () => {
        setCustomProjects(projectsReq.result || []);
      };

      imagesReq.onsuccess = () => {
        const urlMap: Record<string, string> = {};
        (imagesReq.result || []).forEach((item: any) => {
          urlMap[item.id] = URL.createObjectURL(item.file);
        });
        setCoverImageUrls(urlMap);
      };

      attachmentsReq.onsuccess = () => {
        const urlMap: Record<string, string> = {};
        (attachmentsReq.result || []).forEach((item: any) => {
          urlMap[item.id] = URL.createObjectURL(item.file);
        });
        setAttachmentUrls(urlMap);
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

  const addProject = async (
    projectData: Omit<CustomProject, "id" | "createdAt" | "isCustom" | "coverImage" | "attachmentUrl" | "attachmentName">,
    coverImageFile?: File,
    attachmentFile?: File
  ) => {
    const id = Date.now().toString();
    const project: CustomProject = {
      ...projectData,
      id,
      createdAt: new Date().toISOString(),
      isCustom: true,
      coverImage: null,
      attachmentName: attachmentFile?.name || null,
      attachmentUrl: null,
    };

    if (coverImageFile) {
      const imageUrl = URL.createObjectURL(coverImageFile);
      project.coverImage = imageUrl;
      setCoverImageUrls(prev => ({ ...prev, [id]: imageUrl }));
    }

    if (attachmentFile) {
      const attUrl = URL.createObjectURL(attachmentFile);
      project.attachmentUrl = attUrl;
      setAttachmentUrls(prev => ({ ...prev, [id]: attUrl }));
    }

    setCustomProjects(prev => [...prev, project]);

    const db = await initProjectsDB();
    const tx = db.transaction(["projects", "coverImages", "attachments"], "readwrite");
    tx.objectStore("projects").put({ ...project, coverImage: null, attachmentUrl: null });
    if (coverImageFile) {
      tx.objectStore("coverImages").put({ id, file: coverImageFile });
    }
    if (attachmentFile) {
      tx.objectStore("attachments").put({ id, file: attachmentFile });
    }
  };

  const updateProject = async (
    id: string,
    projectData: Partial<CustomProject>,
    coverImageFile?: File,
    attachmentFile?: File
  ) => {
    setCustomProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData } : p));

    const db = await initProjectsDB();
    const tx = db.transaction(["projects", "coverImages", "attachments"], "readwrite");
    const existing = customProjects.find(p => p.id === id);
    if (existing) {
      tx.objectStore("projects").put({ ...existing, ...projectData, coverImage: null, attachmentUrl: null });
    }

    if (coverImageFile) {
      const imageUrl = URL.createObjectURL(coverImageFile);
      setCustomProjects(prev => prev.map(p => p.id === id ? { ...p, coverImage: imageUrl } : p));
      setCoverImageUrls(prev => ({ ...prev, [id]: imageUrl }));
      tx.objectStore("coverImages").put({ id, file: coverImageFile });
    }

    if (attachmentFile) {
      const attUrl = URL.createObjectURL(attachmentFile);
      setCustomProjects(prev => prev.map(p => p.id === id ? {
        ...p,
        attachmentUrl: attUrl,
        attachmentName: attachmentFile.name
      } : p));
      setAttachmentUrls(prev => ({ ...prev, [id]: attUrl }));
      tx.objectStore("attachments").put({ id, file: attachmentFile });
    }
  };

  const deleteProject = async (id: string) => {
    setCustomProjects(prev => prev.filter(p => p.id !== id));
    setCoverImageUrls(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setAttachmentUrls(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    const db = await initProjectsDB();
    const tx = db.transaction(["projects", "coverImages", "attachments"], "readwrite");
    tx.objectStore("projects").delete(id);
    tx.objectStore("coverImages").delete(id);
    tx.objectStore("attachments").delete(id);
  };

  // Merge projects with their ObjectURL-based cover images and attachments
  const projectsWithFiles = customProjects.map(p => ({
    ...p,
    coverImage: coverImageUrls[p.id] || p.coverImage,
    attachmentUrl: attachmentUrls[p.id] || p.attachmentUrl,
  }));

  return {
    isAdmin,
    login,
    logout,
    customProjects: projectsWithFiles,
    addProject,
    updateProject,
    deleteProject,
  };
}
