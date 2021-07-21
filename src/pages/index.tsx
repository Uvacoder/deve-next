import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  FireIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/outline';
import { AppConfigStore, useAppConfigStore } from '@store/app-config.store';
import classNames from 'classnames';
import { NextPage } from 'next';
import React, { useMemo } from 'react';

import Button from '@components/elements/button';
import MenuDropdown, { MenuDropdownItemProps } from '@components/elements/menu-dropdown';
import SpinnerIcon from '@components/icons/spinner-icon';
import LinkItem from '@components/link/link-item';
import TagsFilterSidebar from '@components/tag/tags-filter-sidebar';

import { useCategories } from '@hooks/category/use-categories';
import { LINKS_PER_PAGE, useLinks } from '@hooks/link/use-links';
import { OrderLinksKey, useQueryString } from '@hooks/use-query-string';

const tagsSidebarOpenSelector = (state: AppConfigStore) => state.tagsSidebarOpen;
const setTagsSidebarOpenSelector = (state: AppConfigStore) => state.setTagsSidebarOpen;

const Home: NextPage = () => {
  const tagsSidebarOpen = useAppConfigStore(tagsSidebarOpenSelector);
  const setTagsSidebarOpen = useAppConfigStore(setTagsSidebarOpenSelector);

  const { updateOrderbyQuery, orderbyQuery, tagsQuery, clearTagQuery } = useQueryString();

  const orderLinksDropdownItems: Record<OrderLinksKey, MenuDropdownItemProps> = useMemo(
    () => ({
      newest: {
        text: 'Most recent',
        onClick: () => updateOrderbyQuery('newest'),
        icon: <SortDescendingIcon />,
      },
      oldest: {
        text: 'Oldest',
        onClick: () => updateOrderbyQuery('oldest'),
        icon: <SortAscendingIcon />,
      },
      liked: {
        text: 'Most liked',
        onClick: () => updateOrderbyQuery('liked'),
        icon: <FireIcon />,
      },
    }),
    []
  );

  const {
    data: links,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLinks(orderbyQuery, tagsQuery);
  const { data: tags } = useCategories();

  const canInitialLinksLoadMore = useMemo(
    () => (links?.pages[0].data.length as number) >= LINKS_PER_PAGE,
    [links?.pages[0].data]
  );

  return (
    <div className={classNames({ 'grid grid-cols-[1fr,250px] gap-9': tagsSidebarOpen })}>
      {!links ? (
        <SpinnerIcon className="w-10 m-auto mt-14" />
      ) : (
        <section className="my-8">
          <div className="mb-5 flex justify-between space-x-4">
            <MenuDropdown
              items={Object.values(orderLinksDropdownItems)}
              dropdownPosition="left"
              defaultButtonText={orderLinksDropdownItems[orderbyQuery].text}
            />
            <div className="flex space-x-4 flex-none">
              {tagsQuery.length > 0 && (
                <Button
                  theme="gray"
                  className="flex-none"
                  text="Clear tags"
                  onClick={clearTagQuery}
                />
              )}
              <Button
                theme="secondary"
                className="flex-none"
                onClick={() => setTagsSidebarOpen(!tagsSidebarOpen)}
                icon={tagsSidebarOpen ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
              />
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-5">
            {links?.pages.map((page) =>
              page.data.map((link) => <LinkItem key={link.id} link={link} />)
            )}
          </ul>
          {canInitialLinksLoadMore ? (
            <Button
              theme="secondary"
              text={hasNextPage ? 'Load more' : 'No more links'}
              className="mx-auto mt-8"
              disabled={!hasNextPage}
              loading={isFetchingNextPage}
              onClick={fetchNextPage}
            />
          ) : null}
        </section>
      )}
      {tagsSidebarOpen ? (
        <>
          {!tags ? (
            <SpinnerIcon className="w-8 m-auto mt-14" />
          ) : (
            <TagsFilterSidebar
              tags={tags}
              // -mx-5 px-5 to make ring visible because of overflow
              className="-mx-5 px-5 tags-filter-sidebar-height sticky top-header py-8 overflow-y-auto"
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default Home;
