import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BaseNavLink from '../global/BaseNavLink';

const NavbarLinks = ({ pageNavLinks }) => {
  const navigate = useNavigate();

  return (
    <nav className="static hidden flex-1 items-center justify-center gap-5 lg:flex">
      {pageNavLinks.map((item) => {
        const isDropdown = !!item.dropdown;
        return (
          <div key={item.name} className="group static">
            {isDropdown ? (
              <button
                className={`hover:text-primary relative inline-flex cursor-pointer items-center px-1 text-xs leading-[62px] font-medium text-gray-700 transition-colors`}
                onClick={() => navigate('/products')}
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

            {/* Dropdown Menu */}
            {item.dropdown && (
              <div className="pointer-events-none invisible absolute right-0 left-0 mt-0 border-t border-gray-100 bg-white opacity-0 shadow-lg transition-all duration-200 ease-out group-focus-within:pointer-events-none group-focus-within:invisible group-focus-within:opacity-0 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <div className="mx-auto max-w-7xl p-8">
                  <div className="flex max-h-[60vh] gap-5 overflow-hidden">
                    {/* Slider Section */}
                    <div className="max-h-80 w-50 px-2">
                      <Swiper
                        direction="vertical"
                        modules={[Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        className="mySwiper h-full w-full"
                      >
                        {item.dropdown.slides && item.dropdown.slides.length > 0 ? (
                          item.dropdown.slides.map((slide, index) => (
                            <SwiperSlide key={index} className="h-full">
                              <div className="flex h-full flex-col">
                                <div className="mb-2 flex-1 rounded-lg bg-gray-100">
                                  <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <h4 className="mt-2 text-sm font-medium">{slide.title}</h4>
                              </div>
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            <div className="flex h-full items-center justify-center rounded-lg bg-gray-100">
                              <p className="text-gray-500">No slides available</p>
                            </div>
                          </SwiperSlide>
                        )}
                      </Swiper>
                    </div>

                    {/* Categories Section */}
                    <div className="grid w-full grid-cols-4 gap-8 overflow-y-auto pr-4 pl-4">
                      {/* Men's Section */}
                      {item.dropdown.men && item.dropdown.men.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                            Men
                          </h3>
                          <div className="space-y-2">
                            {item.dropdown.men.map((subItem) => (
                              <BaseNavLink
                                key={subItem.name}
                                to={`${item.path}?gender=men&category=${subItem.params}`}
                                className="hover:text-primary block py-1 text-sm text-gray-600 transition-colors"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {subItem.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Women's Section */}
                      {item.dropdown.women && item.dropdown.women.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                            Women
                          </h3>
                          <div className="space-y-2">
                            {item.dropdown.women.map((subItem) => (
                              <BaseNavLink
                                key={subItem.name}
                                to={`${item.path}?gender=women&category=${subItem.params}`}
                                className="hover:text-primary block py-1 text-sm text-gray-600 transition-colors"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {subItem.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brands Section */}
                      {item.dropdown.brands && item.dropdown.brands.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                            Brands
                          </h3>
                          <div className="space-y-2">
                            {item.dropdown.brands.map((subItem) => (
                              <BaseNavLink
                                key={subItem.name}
                                to={`${item.path}?brand=${subItem.params}`}
                                className="hover:text-primary block py-1 text-sm text-gray-600 capitalize transition-colors"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {subItem.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Collection Section */}
                      {item.dropdown.brands && item.dropdown.brands.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                            Collections
                          </h3>
                          <div className="space-y-2">
                            {item.dropdown.collections.map((subItem) => (
                              <BaseNavLink
                                key={subItem.name}
                                to={`.${subItem.params}`}
                                className="hover:text-primary block py-1 text-sm text-gray-600 capitalize transition-colors"
                                activeBackgroundClassName="hidden"
                                onClick={(e) => e.currentTarget.blur()}
                              >
                                {subItem.name}
                              </BaseNavLink>
                            ))}
                          </div>
                        </div>
                      )}
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
