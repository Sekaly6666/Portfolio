// Mock implementation of the @workspace/api-client-react package
// This file provides placeholder hooks used throughout the portfolio Vite project.
// They return static data or simple async simulators so the UI can render
// without requiring a real backend.

import { useState } from "react";

// ----- Stats hooks (used in Dashboard, Home) -----
export const useGetStats = () => {
  return {
    data: {
      projectsCompleted: 0,
      sitesSupervised: 0,
      plansCreated: 0,
    },
    isLoading: false,
  } as const;
};

export const useGetProjectStats = () => {
  return {
    data: { byType: [] },
    isLoading: false,
  } as const;
};

export const useListMessages = () => {
  return { data: [], isLoading: false } as const;
};

// ----- Posts (Blog) -----
export const useListPosts = () => {
  return { data: [], isLoading: false } as const;
};

export const useGetPost = (id: string) => {
  return { data: null, isLoading: false } as const;
};

export const getGetPostQueryKey = (id: string) => ["post", id];

// ----- Plans -----
export const useListPlans = () => {
  return { data: [], isLoading: false } as const;
};

// ----- Projects -----
export const useListProjects = () => {
  return { data: [], isLoading: false } as const;
};

// ----- Media -----
export const useListMedia = () => {
  return { data: [], isLoading: false } as const;
};

// ----- Messaging (Contact) -----
export const useSendMessage = () => {
  return {
    isPending: false,
    mutate: (payload: any, callbacks: any) => {
      // Simulate async success immediately
      if (callbacks && callbacks.onSuccess) callbacks.onSuccess();
    },
  } as const;
};

// ----- Generic query key helper (used in Blog) -----
export const getQueryKey = (name: string) => [name];
