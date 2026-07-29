import {
  getManagedBlog,
  getManagedHome,
  listManagedBlogs,
  listManagedCustomers,
  listManagedFounderProjects,
  listManagedFounders,
  listManagedHomes,
} from "@/lib/content-store";

export function fetchManagedBlogs() {
  return listManagedBlogs();
}

export function fetchManagedBlog(slug: string) {
  return getManagedBlog(slug);
}

export async function fetchFounderContent() {
  const [founders, projects] = await Promise.all([
    listManagedFounders(),
    listManagedFounderProjects(),
  ]);

  return { founders, projects };
}

export function fetchManagedCustomers() {
  return listManagedCustomers();
}

export function fetchManagedHomes() {
  return listManagedHomes();
}

export function fetchManagedHome(slug: string) {
  return getManagedHome(slug);
}
