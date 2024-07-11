'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb_Shadcn_ as Breadcrumb,
  BreadcrumbList_Shadcn_ as BreadcrumbList,
  BreadcrumbItem_Shadcn_ as BreadcrumbItem,
  BreadcrumbLink_Shadcn_ as BreadcrumbLink,
  BreadcrumbSeparator_Shadcn_ as BreadcrumbSeparator,
  BreadcrumbPage_Shadcn_ as BreadcrumbPage,
  BreadcrumbEllipsis_Shadcn_ as BreadcrumbEllipsis,
  Button,
  cn,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui'
import { getMenuId } from '../app/guides/layout'
import { useBreakpoint } from 'common'
import * as NavItems from './Navigation/NavigationMenu/NavigationMenu.constants'

const Breadcrumbs = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  const menuId = getMenuId(pathname)
  const menu = NavItems[menuId]
  const breadcrumbs = findMenuItemByUrl(menu, pathname, [])
  const [open, setOpen] = React.useState(false)
  const isMobile = useBreakpoint('md')

  const ITEMS_TO_DISPLAY = 3

  if (!breadcrumbs?.length || breadcrumbs?.length === 1) return null

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-foreground-lighter p-0">
        {breadcrumbs.length >= ITEMS_TO_DISPLAY && (
          <>
            <BreadcrumbItem>
              {breadcrumbs[0].url ? (
                <BreadcrumbLink href={`/docs${breadcrumbs[0].url}`}>
                  {breadcrumbs[0].title || breadcrumbs[0].name}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumbs[0].title || breadcrumbs[0].name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {breadcrumbs.length > ITEMS_TO_DISPLAY && (
          <>
            <BreadcrumbItem>
              {!isMobile ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger className="flex items-center gap-1" aria-label="Toggle menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbs.slice(1, -2).map((crumb, index) => (
                      <DropdownMenuItem
                        key={index}
                        className={cn(!crumb.url && 'pointer-events-none')}
                      >
                        {crumb.url ? (
                          <Link href={`/docs${crumb.url}`}>{crumb.title || crumb.name}</Link>
                        ) : (
                          crumb.title || crumb.name
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent showHandle={false}>
                    <div className="grid gap-1 px-4">
                      {breadcrumbs
                        .slice(1, -2)
                        .map((crumb) =>
                          crumb.url ? (
                            <Link href={`/docs${crumb.url}`}>{crumb.title || crumb.name}</Link>
                          ) : (
                            crumb.title || crumb.name
                          )
                        )}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button type="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {breadcrumbs?.slice(-ITEMS_TO_DISPLAY + 1).map((crumb, i) => (
          <Fragment key={crumb.url}>
            {i !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="flex items-center overflow-hidden last:text-foreground-light">
              {crumb.url ? (
                <BreadcrumbLink href={`/docs${crumb.url}`}>
                  {crumb.title || crumb.name}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.title || crumb.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function findMenuItemByUrl(menu, targetUrl, parents = []) {
  // If the menu has items, recursively search through them
  if (menu.items) {
    for (let item of menu.items) {
      console.log('items', item)
      const result = findMenuItemByUrl(item, targetUrl, [...parents, menu])
      if (result) {
        return result
      }
    }
  }

  // Check if the current menu object itself has the target URL
  if (menu.url === targetUrl) {
    return [...parents, menu]
  }

  // If the URL is not found, return null
  return null
}

export default Breadcrumbs
