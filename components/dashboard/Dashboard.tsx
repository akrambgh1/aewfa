"use client";

import { useEffect, useMemo, useState } from "react";
import type { Timestamp } from "firebase/firestore";

import ProjectCard from "./ProjectCard";
import AddProjectDrawer from "./AddProjectDrawer";
import { STATUSES } from "@/lib/dashboard/statuses";

import {
  subscribeToProjects,
  addProject as addProjectDb,
  updateProject as updateProjectDb,
  updateProjectStatus,
  subscribeToMessages,
  markMessageAsRead,
  deleteMessage,
} from "@/lib/dashboard/firestore";

import { useDashboardAuth } from "@/context/dashboard/AuthContext";

/* ===================================================== */
/* TYPES */
/* ===================================================== */

type ProjectStatus = string;

export interface Project {
  id: string;
  apartments?: number | string;
  status?: ProjectStatus;
  [key: string]: unknown;
}

export interface ProjectData {
  id?: string;
  apartments?: number | string;
  status?: ProjectStatus;
  [key: string]: unknown;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt?: Timestamp | Date | string | number | null;
  [key: string]: unknown;
}

type Filter = "all" | string;

type ActiveSection = "projects" | "messages";

interface ProjectsSectionProps {
  projects: Project[];
  visible: Project[];
  loading: boolean;
  loadError: string;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  updateStatus: (
    id: string,
    status: string
  ) => Promise<void>;
  removeProject: (id: string) => Promise<unknown>;
  onAdd: () => void;
  onEdit: (project: Project) => void;
}

interface MessagesSectionProps {
  messages: ContactMessage[];
  loading: boolean;
  error: string;
  onOpen: (
    message: ContactMessage
  ) => Promise<void>;
  onDelete: (
    id: string
  ) => Promise<void>;
}

interface MessageRowProps {
  message: ContactMessage;
  onOpen: () => void;
  onDelete: () => void;
}

interface MessageModalProps {
  message: ContactMessage;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

interface StatProps {
  label: string;
  value: number | string;
}

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  dot?: string;
}

interface EmptyStateProps {
  hasProjects: boolean;
  onAdd: () => void;
}

type FirebaseTimestampLike = {
  toDate: () => Date;
};

/* ===================================================== */
/* DASHBOARD */
/* ===================================================== */

export default function Dashboard() {
  const { user, logout } =
    useDashboardAuth();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [messagesLoading, setMessagesLoading] =
    useState<boolean>(true);

  const [loadError, setLoadError] =
    useState<string>("");

  const [messagesError, setMessagesError] =
    useState<string>("");

  const [drawerOpen, setDrawerOpen] =
    useState<boolean>(false);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [filter, setFilter] =
    useState<Filter>("all");

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("projects");

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  /* ===================================================== */
  /* PROJECTS */
  /* ===================================================== */

  useEffect(() => {
    const unsubscribe =
      subscribeToProjects(
        (data: Project[]) => {
          setProjects(data);
          setLoading(false);
        },
        () => {
          setLoadError(
            "Impossible de charger les projets. Vérifiez votre connexion et vos règles Firestore."
          );

          setLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  /* ===================================================== */
  /* MESSAGES */
  /* ===================================================== */

  useEffect(() => {
    const unsubscribe =
      subscribeToMessages(
        (data: ContactMessage[]) => {
          setMessages(data);
          setMessagesLoading(false);
        },
        () => {
          setMessagesError(
            "Impossible de charger les messages."
          );

          setMessagesLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  /* ===================================================== */
  /* ADD PROJECT */
  /* ===================================================== */

  async function addProject(
    data: ProjectData
  ): Promise<void> {
    await addProjectDb(data);

    setDrawerOpen(false);
    setEditingProject(null);
  }

  /* ===================================================== */
  /* EDIT PROJECT */
  /* ===================================================== */

  async function editProject(
    data: ProjectData
  ): Promise<void> {
    if (!data?.id) {
      throw new Error(
        "Identifiant du projet manquant."
      );
    }

    const { id, ...projectData } = data;

    await updateProjectDb(
      id,
      projectData
    );

    setDrawerOpen(false);
    setEditingProject(null);
  }

  /* ===================================================== */
  /* OPEN EDITOR */
  /* ===================================================== */

  function handleEditProject(
    project: Project
  ): void {
    setEditingProject(project);
    setDrawerOpen(true);
  }

  /* ===================================================== */
  /* CLOSE DRAWER */
  /* ===================================================== */

  function handleDrawerClose(): void {
    setDrawerOpen(false);
    setEditingProject(null);
  }

  /* ===================================================== */
  /* UPDATE STATUS */
  /* ===================================================== */

  async function updateStatus(
    id: string,
    status: string
  ): Promise<void> {
    await updateProjectStatus(
      id,
      status
    );
  }

  /* ===================================================== */
  /* DELETE PROJECT */
  /* ===================================================== */

  async function removeProject(
    id: string
  ): Promise<unknown> {
    if (!id) {
      throw new Error(
        "Identifiant du projet manquant."
      );
    }

    const url = `/api/projects/${encodeURIComponent(
      id
    )}`;

    let response: Response;

    try {
      response = await fetch(url, {
        method: "DELETE",
        cache: "no-store",
      });
    } catch {
      throw new Error(
        "Impossible de contacter le serveur."
      );
    }

    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      // Response may not contain JSON.
    }

    if (!response.ok) {
      const errorData =
        data as { error?: string } | null;

      throw new Error(
        errorData?.error ||
          `Impossible de supprimer le projet. Erreur ${response.status}.`
      );
    }

    return data;
  }

  /* ===================================================== */
  /* MESSAGE ACTIONS */
  /* ===================================================== */

  async function handleOpenMessage(
    message: ContactMessage
  ): Promise<void> {
    setSelectedMessage(message);

    if (!message.read) {
      try {
        await markMessageAsRead(
          message.id
        );
      } catch (error: unknown) {
        console.error(
          "Impossible de marquer le message comme lu:",
          error
        );
      }
    }
  }

  async function handleDeleteMessage(
    id: string
  ): Promise<void> {
    if (!id) return;

    try {
      await deleteMessage(id);

      if (
        selectedMessage?.id === id
      ) {
        setSelectedMessage(null);
      }
    } catch (error: unknown) {
      console.error(
        "Impossible de supprimer le message:",
        error
      );
    }
  }

  /* ===================================================== */
  /* STATISTICS */
  /* ===================================================== */

  const stats = useMemo(() => {
    const totalApartments =
      projects.reduce(
        (sum, project) =>
          sum +
          (Number(project.apartments) ||
            0),
        0
      );

    const construction =
      projects.filter(
        (project) =>
          project.status ===
          "construction"
      ).length;

    const completed =
      projects.filter(
        (project) =>
          project.status ===
          "completed"
      ).length;

    const unreadMessages =
      messages.filter(
        (message) => !message.read
      ).length;

    return {
      projects: projects.length,
      apartments: totalApartments,
      construction,
      completed,
      messages: messages.length,
      unreadMessages,
    };
  }, [projects, messages]);

  /* ===================================================== */
  /* FILTER PROJECTS */
  /* ===================================================== */

  const visible = useMemo(() => {
    if (filter === "all") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.status === filter
    );
  }, [projects, filter]);

  return (
    <div className="min-h-screen bg-[#f5ede0]">

      <header className="border-b border-[#c4956a33] bg-[#f5ede0]">

        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4956a]">
              El Rayane Immobilier
            </span>

            <h1 className="mt-2 font-serif text-5xl font-light text-[#1a1410]">
              Tableau de bord
            </h1>

            <p className="mt-2 text-sm text-[#6b5c4e]">
              Gestion de votre portefeuille immobilier
            </p>
          </div>

          <div className="flex items-center gap-3">

            {activeSection ===
              "projects" && (
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setDrawerOpen(true);
                }}
                className="bg-[#1a1410] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#c4956a]"
              >
                + Nouveau projet
              </button>
            )}

            <button
              type="button"
              onClick={logout}
              title={user?.email ?? ""}
              className="border border-[#c4956a55] px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-[#6b5c4e] transition hover:border-[#1a1410] hover:text-[#1a1410]"
            >
              Déconnexion
            </button>

          </div>

        </div>

        <div className="mx-auto max-w-6xl px-6">

          <div className="flex gap-8">

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "projects"
                )
              }
              className={`relative pb-4 text-[10px] uppercase tracking-[0.2em] transition ${
                activeSection ===
                "projects"
                  ? "text-[#1a1410]"
                  : "text-[#6b5c4e] hover:text-[#1a1410]"
              }`}
            >
              Projets

              {activeSection ===
                "projects" && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[#c4956a]" />
              )}

            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "messages"
                )
              }
              className={`relative flex items-center gap-2 pb-4 text-[10px] uppercase tracking-[0.2em] transition ${
                activeSection ===
                "messages"
                  ? "text-[#1a1410]"
                  : "text-[#6b5c4e] hover:text-[#1a1410]"
              }`}
            >
              Messages

              {stats.unreadMessages >
                0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8f3f32] px-1.5 text-[8px] text-white">
                  {stats.unreadMessages}
                </span>
              )}

              {activeSection ===
                "messages" && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[#c4956a]" />
              )}

            </button>

          </div>

        </div>

        {activeSection ===
          "projects" && (
          <div className="mx-auto grid max-w-6xl grid-cols-2 border-t border-[#c4956a33] sm:grid-cols-4">

            <Stat
              label="Projets"
              value={stats.projects}
            />

            <Stat
              label="Appartements"
              value={stats.apartments}
            />

            <Stat
              label="En construction"
              value={stats.construction}
            />

            <Stat
              label="Terminés"
              value={stats.completed}
            />

          </div>
        )}

        {activeSection ===
          "messages" && (
          <div className="mx-auto grid max-w-6xl grid-cols-2 border-t border-[#c4956a33]">

            <Stat
              label="Messages"
              value={stats.messages}
            />

            <Stat
              label="Non lus"
              value={stats.unreadMessages}
            />

          </div>
        )}

      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">

        {activeSection ===
        "projects" ? (

          <ProjectsSection
            projects={projects}
            visible={visible}
            loading={loading}
            loadError={loadError}
            filter={filter}
            setFilter={setFilter}
            updateStatus={updateStatus}
            removeProject={removeProject}
            onAdd={() => {
              setEditingProject(null);
              setDrawerOpen(true);
            }}
            onEdit={handleEditProject}
          />

        ) : (

          <MessagesSection
            messages={messages}
            loading={messagesLoading}
            error={messagesError}
            onOpen={handleOpenMessage}
            onDelete={handleDeleteMessage}
          />

        )}

      </main>

      <AddProjectDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onSubmit={
          editingProject
            ? editProject
            : addProject
        }
        project={editingProject}
      />

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() =>
            setSelectedMessage(null)
          }
          onDelete={handleDeleteMessage}
        />
      )}

    </div>
  );
}

/* ===================================================== */
/* PROJECTS SECTION */
/* ===================================================== */

function ProjectsSection({
  projects,
  visible,
  loading,
  loadError,
  filter,
  setFilter,
  updateStatus,
  removeProject,
  onAdd,
  onEdit,
}: ProjectsSectionProps) {
  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">

        <FilterPill
          active={filter === "all"}
          onClick={() =>
            setFilter("all")
          }
          label="Tous les projets"
        />

        {STATUSES.map((status) => (

          <FilterPill
            key={status.id}
            active={
              filter === status.id
            }
            onClick={() =>
              setFilter(status.id)
            }
            label={status.label}
            dot={status.dot}
          />

        ))}

      </div>

      {loadError && (
        <p className="mb-6 border-l-2 border-red-500 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      )}

      {loading ? (

        <div className="py-20 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6b5c4e]">
            Chargement des projets...
          </span>
        </div>

      ) : visible.length === 0 ? (

        <EmptyState
          hasProjects={
            projects.length > 0
          }
          onAdd={onAdd}
        />

      ) : (

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {visible.map(
            (project, index) => (

              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onStatusChange={
                  updateStatus
                }
                onDelete={
                  removeProject
                }
                onEdit={onEdit}
              />

            )
          )}

        </div>

      )}

    </>
  );
}

/* ===================================================== */
/* MESSAGES SECTION */
/* ===================================================== */

function MessagesSection({
  messages,
  loading,
  error,
  onOpen,
  onDelete,
}: MessagesSectionProps) {

  return (
    <section>

      <div className="mb-8">

        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#c4956a]">
          Correspondance
        </span>

        <h2 className="mt-2 font-serif text-4xl font-light text-[#1a1410]">
          Messages
        </h2>

        <p className="mt-2 text-sm text-[#6b5c4e]">
          Les demandes envoyées depuis votre site.
        </p>

      </div>

      {error && (
        <div className="mb-6 border-l-2 border-red-500 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (

        <div className="py-20 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6b5c4e]">
            Chargement des messages...
          </span>
        </div>

      ) : messages.length === 0 ? (

        <div className="border border-dashed border-[#c4956a55] py-24 text-center">

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#c4956a]">
            Correspondance
          </span>

          <h2 className="mt-3 font-serif text-3xl font-light text-[#1a1410]">
            Aucun message
          </h2>

          <p className="mt-2 text-sm text-[#6b5c4e]">
            Les messages envoyés depuis la page contact apparaîtront ici.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {messages.map(
            (message) => (

              <MessageRow
                key={message.id}
                message={message}
                onOpen={() =>
                  onOpen(message)
                }
                onDelete={() =>
                  onDelete(message.id)
                }
              />

            )
          )}

        </div>

      )}

    </section>
  );
}

/* ===================================================== */
/* MESSAGE ROW */
/* ===================================================== */

function MessageRow({
  message,
  onOpen,
  onDelete,
}: MessageRowProps) {

  const date =
    formatMessageDate(
      message.createdAt
    );

  return (
    <article
      className={`group border bg-[#f5ede0] transition ${
        message.read
          ? "border-[#c4956a33]"
          : "border-[#c4956a88] bg-[#ede0cc]/50"
      }`}
    >

      <button
        type="button"
        onClick={onOpen}
        className="w-full px-5 py-5 text-left sm:px-6"
      >

        <div className="flex items-start justify-between gap-5">

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-3">

              {!message.read && (
                <span className="bg-[#8f3f32] px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-white">
                  Nouveau
                </span>
              )}

              <h3 className="font-serif text-xl text-[#1a1410]">
                {message.name}
              </h3>

            </div>

            <p className="mt-1 text-xs text-[#c4956a]">
              {message.email}
            </p>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6b5c4e]">
              {message.message}
            </p>

          </div>

          <div className="hidden shrink-0 text-right sm:block">

            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#6b5c4e]">
              {date}
            </span>

            <span className="mt-3 block text-[9px] uppercase tracking-[0.15em] text-[#c4956a]">
              Voir
            </span>

          </div>

        </div>

      </button>

      <div className="flex justify-end border-t border-[#c4956a22] px-5 py-2 sm:px-6">

        <button
          type="button"
          onClick={onDelete}
          className="text-[9px] uppercase tracking-[0.15em] text-[#8f3f32] opacity-70 transition hover:opacity-100"
        >
          Supprimer
        </button>

      </div>

    </article>
  );
}

/* ===================================================== */
/* MESSAGE MODAL */
/* ===================================================== */

function MessageModal({
  message,
  onClose,
  onDelete,
}: MessageModalProps) {

  useEffect(() => {

    function handleKeyDown(
      event: KeyboardEvent
    ): void {

      if (event.key === "Escape") {
        onClose();
      }

    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1a1410]/70 px-5 backdrop-blur-sm"
      onMouseDown={(
        event: React.MouseEvent<HTMLDivElement>
      ) => {

        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div className="w-full max-w-2xl overflow-hidden border border-[#c4956a55] bg-[#f5ede0] shadow-2xl">

        <div className="bg-[#1a1410] px-6 py-6 text-white sm:px-8">

          <div className="mb-4 flex items-center gap-3">

            <span className="h-px w-7 bg-[#c4956a]" />

            <span className="text-[9px] uppercase tracking-[0.3em] text-[#c4956a]">
              El Rayane Immobilier
            </span>

          </div>

          <div className="flex items-start justify-between gap-5">

            <div>

              <h2 className="font-serif text-3xl font-light">
                {message.name}
              </h2>

              <p className="mt-2 text-sm text-white/60">
                {message.email}
              </p>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="border border-white/20 px-3 py-2 text-xs text-white/70 transition hover:border-[#c4956a] hover:text-[#c4956a]"
            >
              ✕
            </button>

          </div>

        </div>

        <div className="px-6 py-7 sm:px-8">

          <div className="mb-5 flex items-center justify-between">

            <span className="text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
              Message reçu
            </span>

            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#c4956a]">

              {formatMessageDate(
                message.createdAt
              )}

            </span>

          </div>

          <div className="border border-[#c4956a33] bg-[#ede0cc]/50 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7 text-[#1a1410]">
              {message.message}
            </p>

          </div>

          <div className="mt-6 flex gap-3">

            <a
              href={`mailto:${message.email}`}
              className="flex flex-1 items-center justify-center bg-[#1a1410] px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-white transition hover:bg-[#c4956a]"
            >
              Répondre par e-mail
            </a>

            <button
              type="button"
              onClick={() => {
                void onDelete(message.id);
                onClose();
              }}
              className="border border-[#8f3f32]/40 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#8f3f32] transition hover:bg-[#8f3f32] hover:text-white"
            >
              Supprimer
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ===================================================== */
/* DATE */
/* ===================================================== */



function formatMessageDate(
  timestamp:
    | Timestamp
    | string
    | number
    | Date
    | null
    | undefined
) {
  if (!timestamp) {
    return "Date inconnue";
  }

  let date: Date;

  if (
    typeof timestamp === "string" ||
    typeof timestamp === "number"
  ) {
    date = new Date(timestamp);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = timestamp.toDate();
  }

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* ===================================================== */
/* STAT */
/* ===================================================== */

function Stat({
  label,
  value,
}: StatProps) {

  return (
    <div className="border-r border-[#c4956a33] px-5 py-5 last:border-r-0">

      <div className="font-serif text-3xl font-light text-[#1a1410]">
        {value}
      </div>

      <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#6b5c4e]">
        {label}
      </div>

    </div>
  );
}

/* ===================================================== */
/* FILTER PILL */
/* ===================================================== */

function FilterPill({
  active,
  onClick,
  label,
  dot,
}: FilterPillProps) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 border px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition ${
        active
          ? "border-[#1a1410] bg-[#1a1410] text-white"
          : "border-[#c4956a55] bg-transparent text-[#6b5c4e] hover:border-[#1a1410] hover:text-[#1a1410]"
      }`}
    >

      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dot}`}
        />
      )}

      {label}

    </button>
  );
}

/* ===================================================== */
/* EMPTY STATE */
/* ===================================================== */

function EmptyState({
  hasProjects,
  onAdd,
}: EmptyStateProps) {

  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[#c4956a55] py-24 text-center">

      <span className="text-[10px] uppercase tracking-[0.3em] text-[#c4956a]">
        Portefeuille
      </span>

      <h2 className="mt-3 font-serif text-3xl font-light text-[#1a1410]">

        {hasProjects
          ? "Aucun projet trouvé"
          : "Votre portefeuille est vide"}

      </h2>

      <p className="mt-2 max-w-sm text-sm text-[#6b5c4e]">

        {hasProjects
          ? "Essayez un autre filtre."
          : "Ajoutez votre premier projet immobilier pour commencer."}

      </p>

      {!hasProjects && (

        <button
          type="button"
          onClick={onAdd}
          className="mt-6 bg-[#1a1410] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#c4956a]"
        >
          + Ajouter un projet
        </button>

      )}

    </div>
  );
}