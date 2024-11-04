'use client';

import React from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

function DashboardBreadcrumb() {
  const path = usePathname();
  const pathSegments = path.split('/').filter(Boolean);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;

    return (
      <React.Fragment key={href}>
        <BreadcrumbItem>
          {index === pathSegments.length - 1 ? (
            <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={href}>{capitalize(segment)}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {/* Render the separator only if it's not the last item */}
        {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {path === '/' ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Properties</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbItems}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default DashboardBreadcrumb;
