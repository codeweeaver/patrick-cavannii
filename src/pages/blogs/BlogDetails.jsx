import { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiEye, FiHeart, FiTag } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import AnimatedPage from '../../components/global/AnimatedPage';
import LoadingSpinner from '../../components/global/LoadingSpinner';

const BlogDetails = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${blogId}`);
        if (!response.ok) throw new Error('Blog not found');
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Blog post not found</h2>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <header className="mb-12 text-center">
              <div className="mb-6 flex flex-wrap justify-center gap-3">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                  >
                    <FiTag size={12} /> {tag}
                  </span>
                ))}
              </div>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">{blog.title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500">
                <span className="flex items-center gap-2">
                  <FiCalendar /> {blog.date}
                </span>
                <span className="flex items-center gap-2">
                  <FiClock /> {Math.ceil(blog.excerpt.length / 50)} min read
                </span>
                <span className="flex items-center gap-2">
                  <FiEye /> {blog.views} views
                </span>
                <span className="flex items-center gap-2">
                  <FiHeart /> {blog.likes} likes
                </span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-12 aspect-video overflow-hidden rounded-2xl shadow-lg">
              <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p className="mb-6 text-xl leading-relaxed text-gray-700">{blog.excerpt}</p>
              <div className="space-y-4 leading-relaxed text-gray-800">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius,
                  turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis
                  sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et
                  risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut
                  ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien
                  risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque
                  malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis,
                  neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed
                  pretium diam pede ut quam. Curabitur vel sem sit amet nulla malesuada adipiscing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default BlogDetails;
