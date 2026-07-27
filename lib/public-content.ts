import {
  getManagedBlog,
  getManagedFounder,
  listManagedBlogs,
  listManagedCustomers,
  listManagedFounderProjects,
} from "@/lib/content-store";

export function fetchManagedBlogs() {
  return listManagedBlogs();
}

export function fetchManagedBlog(slug: string) {
  return getManagedBlog(slug);
}

export async function fetchFounderContent() {
  const [founder, projects] = await Promise.all([
    getManagedFounder(),
    listManagedFounderProjects(),
  ]);
  return { founder, projects };
}

export function fetchManagedCustomers() {
  return listManagedCustomers();
}
