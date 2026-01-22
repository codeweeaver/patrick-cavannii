import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiHeart,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import ReactPaginate from 'react-paginate';
import { Link, useSearchParams } from 'react-router-dom';
import AnimatedPage from '../../components/global/AnimatedPage';

// Mock data - Fashion blog posts
const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [likedPosts, setLikedPosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Extract all unique hashtags from blog posts
  const allHashtags = [...new Set(posts.flatMap((post) => post.tags))];

  // Get popular posts (sorted by views)
  const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 3);

  // Toggle like for a post
  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Get like count for a post
  const getLikeCount = (postId, baseLikes) => {
    return likedPosts[postId] ? baseLikes + 1 : baseLikes;
  };

  // Filter posts based on a search query and active tags
  const filteredPosts = posts
    .map((post) => ({ ...post, likes: getLikeCount(post.id, post.likes) }))
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        activeTags.length === 0 || activeTags.every((tag) => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

  // Pagination logic
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);
  const offset = currentPage * postsPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page if current page is out of bounds after filtering
  useEffect(() => {
    if (currentPage > 0 && filteredPosts.length <= currentPage * postsPerPage) {
      setCurrentPage(0);
    }
  }, [filteredPosts.length, currentPage, postsPerPage]);

  // 1. URL -> State
  useEffect(() => {
    const search = searchParams.get('search') || '';
    if (search !== searchQuery) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // 2. State -> URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, setSearchParams]);

  const toggleTag = (tag) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearAllTags = () => {
    setActiveTags([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const hoverEffect = {
    scale: 1.02,
    transition: { duration: 0.2 },
  };

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <motion.section
        className="relative mb-8 overflow-hidden bg-linear-to-r from-gray-900 to-gray-800 py-24 text-white md:py-36"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Fashion Insights & Trends
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover the latest in fashion, style tips, and industry news from our expert stylists.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-gray-50 to-transparent" />
      </motion.section>

      <motion.section
        className="mb-20 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col gap-8 lg:flex-row"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Sidebar */}
            <motion.div className="space-y-6 lg:w-1/3" variants={itemVariants}>
              {/* Search */}
              <motion.div
                className="rounded-md border border-gray-200 bg-white p-5 shadow-sm"
                whileHover={{
                  y: -2,
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Search</h3>
                <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-primary/50 focus:border-primary w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 transition-colors duration-200 focus:ring-2 focus:outline-none"
                  />
                  <FiSearch className="absolute top-3 left-3 text-gray-400" />
                </motion.div>
              </motion.div>

              {/* Active Tags */}
              <AnimatePresence>
                {activeTags.length > 0 && (
                  <motion.div
                    className="rounded-md border border-gray-200 bg-white p-5 shadow-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Active Filters</h3>
                      <motion.button
                        onClick={clearAllTags}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        whileHover={{ x: 2 }}
                      >
                        Clear all
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {activeTags.map((tag, index) => (
                          <motion.button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className="bg-primary/80 hover:bg-primary flex items-center rounded-full px-3 py-1 text-sm font-medium text-white transition-colors"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {tag}
                            <FiX className="ml-1" size={16} />
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Popular Tags */}
              <motion.div
                className="rounded-md border border-gray-200 bg-white p-5 shadow-sm"
                variants={itemVariants}
              >
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allHashtags.map((hashtag, index) => (
                    <motion.button
                      key={index}
                      onClick={() => toggleTag(hashtag)}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        activeTags.includes(hashtag)
                          ? 'bg-primary/80 hover:bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {hashtag}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Popular Posts */}
              <motion.div
                className="rounded-md border border-gray-200 bg-white p-5 shadow-sm"
                variants={itemVariants}
              >
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Popular Blogs</h3>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={`/blogs/${post.id}`}
                        className="group flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-gray-50"
                      >
                        <motion.div
                          className="h-16 w-16 shrink-0 overflow-hidden rounded-md"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                        <div>
                          <h4 className="line-clamp-2 font-medium text-gray-700 transition-colors">
                            {post.title}
                          </h4>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span className="flex items-center">
                              <FiEye className="mr-1" size={12} /> {post.views}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <FiHeart className="mr-1" size={12} /> {post.likes}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div className="lg:w-3/4" variants={itemVariants}>
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {/* Active Tags */}
                  <AnimatePresence>
                    {activeTags.length > 0 && (
                      <motion.div
                        className="mb-6 rounded-md border border-blue-100 bg-blue-50 p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-sm text-gray-600">Filtered by:</span>
                          {activeTags.map((tag, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-1 rounded-full border border-blue-200 bg-white px-3 py-1 text-sm text-blue-700"
                            >
                              {tag}
                              <button
                                onClick={() => toggleTag(tag)}
                                className="ml-1 text-blue-400 hover:text-blue-700"
                                aria-label={`Remove ${tag} filter`}
                              >
                                <FiX size={16} />
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={clearAllTags}
                            className="ml-2 text-sm font-medium text-blue-600 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Blog Grid */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <AnimatePresence>
                      {filteredPosts.slice(offset, offset + postsPerPage).map((post, index) => (
                        <motion.div
                          key={post.id}
                          custom={index % 4}
                          variants={cardVariants}
                          initial="hidden"
                          animate="show"
                          whileHover="hover"
                          className="h-full"
                        >
                          <div className="group block flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                            <motion.div
                              className="h-48 overflow-hidden"
                              whileHover={{ scale: 1.03 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.img
                                src={post.image}
                                alt={post.title}
                                className="h-full w-full object-cover"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                              />
                            </motion.div>
                            <div className="flex flex-1 flex-col p-5">
                              <div className="mb-3 flex flex-wrap gap-2">
                                {post.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="cursor-pointer rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200"
                                    onClick={() => toggleTag(tag)}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors">
                                {post.title}
                              </h3>
                              <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                                {post.excerpt}
                              </p>
                              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                <Link
                                  to={`/blogs/${post.id}`}
                                  className="text-primary flex items-center text-sm font-medium hover:underline"
                                >
                                  Read more <FiArrowRight className="ml-1" size={16} />
                                </Link>
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center text-xs text-gray-500">
                                    <FiEye className="mr-1" size={14} />
                                    {post.views}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleLike(post.id);
                                    }}
                                    className={`flex items-center text-xs ${
                                      likedPosts[post.id] ? 'text-red-500' : 'text-gray-500'
                                    }`}
                                  >
                                    <FiHeart
                                      className="mr-1"
                                      size={14}
                                      fill={likedPosts[post.id] ? 'currentColor' : 'none'}
                                    />
                                    {post.likes}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {pageCount > 1 && (
                    <div className="mt-16">
                      <ReactPaginate
                        previousLabel={<FiChevronLeft className="h-5 w-5" />}
                        nextLabel={<FiChevronRight className="h-5 w-5" />}
                        breakLabel="..."
                        breakClassName="flex items-center justify-center"
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName="flex items-center justify-center space-x-2"
                        pageClassName="flex"
                        pageLinkClassName="px-3 py-1 rounded-md hover:bg-gray-200 cursor-pointer"
                        activeLinkClassName="bg-primary text-white hover:bg-primary cursor-pointer"
                        previousClassName="flex items-center"
                        nextClassName="flex items-center"
                        previousLinkClassName="p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                        nextLinkClassName="p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                        disabledClassName="opacity-50"
                        forcePage={currentPage}
                      />
                    </div>
                  )}

                  {filteredPosts.length === 0 && (
                    <div className="col-span-2 py-12 text-center">
                      <p className="text-gray-500">No articles found matching your criteria.</p>
                      <button
                        onClick={clearAllTags}
                        className="mt-4 rounded border border-black px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </AnimatedPage>
  );
};

export default Blogs;
