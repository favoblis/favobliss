import { getBlogs } from "@/actions/get-blogs";
import BlogList from "@/components/BlogsEditor/BlogList";

interface Props {
  searchParams: { page?: string };
}

export default async function BlogPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const limit = 9;

  const data = await getBlogs(page, limit);
  const publishedBlogs = data.blogs.filter((b) => b.published);

  return (
    <BlogList
      initialBlogs={publishedBlogs}
      currentPage={page}
      totalBlogs={data.total}
      limit={limit}
    />
  );
}