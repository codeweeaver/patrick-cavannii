import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BaseNavLink from '../global/BaseNavLink';

const NavbarLinks = ({ pageNavLinks }) => {
  const navigate = useNavigate();

  // Helper to ensure clean URL construction
  const buildLink = (basePath, gender, categorySlug) => {
    const params = new URLSearchParams();
    if (gender) params.append('gender', gender);
    if (categorySlug) params.append('category', categorySlug);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="static hidden flex-1 items-center justify-center gap-5 lg:flex">
      {pageNavLinks.map((item) => {
        const isDropdown = !!item.dropdown;

        return (
          <div key={item.name} className="group static">
            {isDropdown ? (
              <button
                className="hover:text-primary relative inline-flex cursor-pointer items-center px-1 text-xs leading-[62px] font-medium text-gray-700 transition-colors"
                onClick={() => navigate(item.path || '/products')}
              >
                <span className="whitespace-nowrap">
                  {item.name}
                  <FiChevronDown className="ml-1 inline h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                </span>
              </button>
            ) : (
              <BaseNavLink
                to={item.path}
                end={item.path === '/'}
                className="relative inline-flex items-center px-1 text-xs leading-[62px] font-medium transition-colors"
                activeClassName="text-primary border-primary border-b-2"
                inactiveClassName="hover:text-primary text-gray-700"
                activeBackgroundClassName="hidden"
              >
                <span className="whitespace-nowrap">{item.name}</span>
              </BaseNavLink>
            )}

            {/* Dropdown Menu (Mega Menu) */}
            {item.dropdown && (
              <div className="pointer-events-none invisible absolute right-0 left-0 mt-0 border-t border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 z-50">
                <div className="mx-auto max-w-7xl p-8">
                  <div className="flex max-h-[70vh] gap-10">

                    {/* Visual Slider Section */}
                    <div className="h-80 w-64 shrink-0">
                      <Swiper
                        direction="vertical"
                        modules={[Autoplay, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        className="h-full w-full rounded-xl overflow-hidden shadow-inner"
                      >
                        {item.dropdown.slides?.length > 0 ? (
                          item.dropdown.slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                              <div className="relative h-full w-full group/slide cursor-pointer">
                                <img
                                  src={slide.image}
                                  alt={slide.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover/slide:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 p-4">
                                  <h4 className="text-sm font-bold text-white">{slide.title}</h4>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400 text-xs">
                              No Featured Items
                            </div>
                          </SwiperSlide>
                        )}
                      </Swiper>
                    </div>

                    {/* Links Grid */}
                    <div className="grid flex-1 grid-cols-4 gap-8 overflow-y-auto pb-4">

                      {/* Men's Column */}
                      {item.dropdown.men?.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-2">
                            Men
                          </h3>
                          <div className="flex flex-col gap-1">
                            {item.dropdown.men.map((sub) => (
                              <BaseNavLink
                                key={sub.name}
                                // FIX: Use buildLink to handle slug (sub.params)
                                to={buildLink(item.path, 'men', sub.params)}
                                className="hover:text-primary py-1 text-sm text-gray-500 transition-colors"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {sub.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Women's Column */}
                      {item.dropdown.women?.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-2">
                            Women
                          </h3>
                          <div className="flex flex-col gap-1">
                            {item.dropdown.women.map((sub) => (
                              <BaseNavLink
                                key={sub.name}
                                // FIX: Use buildLink to handle slug (sub.params)
                                to={buildLink(item.path, 'women', sub.params)}
                                className="hover:text-primary py-1 text-sm text-gray-500 transition-colors"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {sub.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brands Column */}
                      {item.dropdown.brands?.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-2">
                            Brands
                          </h3>
                          <div className="flex flex-col gap-1">
                            {item.dropdown.brands.map((sub) => (
                              <BaseNavLink
                                key={sub.name}
                                // FIX: Use brand param specifically
                                to={`${item.path}?brand=${sub.params}`}
                                className="hover:text-primary py-1 text-sm text-gray-500 capitalize transition-colors"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {sub.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Collections Column */}
                      {/* {item.dropdown.collections?.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-2">
                            Collections
                          </h3>
                          <div className="flex flex-col gap-1">
                            {item.dropdown.collections.map((sub) => (
                              <BaseNavLink
                                key={sub.name}
                                // FIX: Direct navigation to specific collection path
                                to={`${item.path}/${sub.params}`}
                                className="hover:text-primary py-1 text-sm text-gray-500 transition-colors font-medium"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {sub.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavbarLinks;
