# Web Application UI Layout Overview (Portalwizard - apps/web)

This document provides an overview of the main UI layout components for the `portalwizard/apps/web` application, specifically focusing on the Sidebar, Header, and Main Content area. This serves as a reference for the current implementation, especially considering future developments like a dual portal.

## Overall Architecture:

The application employs a responsive layout featuring:
- A **collapsible sidebar** on the left.
- A **fixed header** at the top.
- A **main content area** that dynamically adjusts to the sidebar's state.

Core layout logic is managed within `apps/web/src/app/dashboard/layout.tsx`, utilizing a `SidebarProvider` (from `apps/web/src/components/ui/sidebar.tsx`) for state management and CSS variables for consistent sizing. Tailwind CSS is used extensively for styling and responsiveness, including group variants (e.g., `group-data-[state=collapsed]/sidebar-wrapper`) to react to sidebar state changes.

## 1. Sidebar (`apps/web/src/components/app-sidebar.tsx`)

The sidebar is the primary navigation element.

-   **Functionality:**
    -   Collapsible on desktop:
        -   Expanded width: `16rem` (defined by CSS variable `--sidebar-width`).
        -   Collapsed width: `4.5rem` (defined by CSS variable `--sidebar-width-icon`). The collapsed state is typically icon-only.
    -   On mobile devices, it functions as an off-canvas drawer, overlaying the content.
-   **Structure & Styling (driven by `apps/web/src/components/ui/sidebar.tsx` primitives):**
    -   The main `<aside>` element's width is dynamically controlled by `data-state` attributes.
    -   `overflow-hidden` is applied to prevent child elements from visually breaking boundaries, especially when collapsed.
    -   Consists of a header (logo, search), main content (navigation groups and items), and a footer (settings, help, user actions).
-   **Content Adaptation in Collapsed State:**
    -   **Logo (`BrandLogoLink`):** Switches from full logo to a compact icon.
    -   **Search Form:** Hidden.
    -   **Section Titles (`SidebarGroupLabel`):** Hidden.
    -   **Navigation Items (`SidebarMenuButton`):**
        -   Text labels are visually hidden.
        -   Icons are centered.
        -   Padding and dimensions are adjusted for a compact, icon-centric display.
    -   **Dividers (`hr`):** Hidden.

## 2. Header (`apps/web/src/components/header.tsx`)

The header provides global actions and navigation context.

-   **Functionality:**
    -   Includes theme toggling (`ModeToggle`), user account management (`UserMenu`), and breadcrumb navigation (`Breadcrumbs`).
    -   Features a button to toggle the sidebar's expanded/collapsed state on non-mobile views.
-   **Structure & Styling:**
    -   `position: fixed; top: 0; right: 0;`
    -   `z-index: 50;` (to stay above other content).
    -   **Height:** `h-[calc(4rem+3.5px)]` (precisely 67.5px). This specific height was chosen to ensure perfect vertical alignment with a divider in the sidebar footer.
    -   `border-b border-border`: Provides visual separation.
    -   **Dynamic `left` Offset:**
        -   **Mobile:** `left-0` (header spans full width).
        -   **Desktop Collapsed:** `left-[var(--sidebar-width-icon)]` (aligns with the `4.5rem` collapsed sidebar).
        -   **Desktop Expanded:** `left-[var(--sidebar-width)]` (aligns with the `16rem` expanded sidebar).

## 3. Main Content Area (`apps/web/src/app/dashboard/layout.tsx`)

This is where page-specific content is rendered.

-   **Functionality:**
    -   Resides to the right of the sidebar and below the fixed header.
-   **Structure & Styling (Wrapper Div within `layout.tsx`):**
    -   A `div` wraps the `Header` component (via `HeaderWithSidebarToggle`) and the main page content area (`SidebarInset`, which renders the `<main>` tag).
    -   **Dynamic `margin-left`:**
        -   **Mobile:** `ml-0`.
        -   **Desktop Collapsed:** `md:data-[state=collapsed]/sidebar-wrapper:ml-[var(--sidebar-width-icon)]`.
        -   **Desktop Expanded:** `md:data-[state=expanded]/sidebar-wrapper:ml-[var(--sidebar-width)]`.
        -   A `transition-[margin-left]` ensures smooth animation.
    -   **`padding-top: pt-[calc(4rem+3.5px)]`:** This padding on the wrapper `div` is crucial. It's precisely equal to the fixed header's height, preventing the actual page content (within `SidebarInset`) from being obscured by the fixed header.
-   **`SidebarInset` Component:**
    -   Renders as the semantic `<main>` HTML5 element.
    -   Contains the `DashboardClientLayout`, which renders the specific content for the current route.

## Key Layout Achievements:

-   **Seamless Integration:** Sidebar, header, and main content adjust dynamically and cohesively.
-   **Pixel-Perfect Alignment:** The header's bottom border and the sidebar footer's `hr` divider are vertically aligned when the sidebar is expanded, thanks to the `h-[calc(4rem+3.5px)]` header height and corresponding `pt-[calc(4rem+3.5px)]` on the content wrapper.
-   **Responsiveness:** Graceful adaptation from desktop to mobile views.
-   **State Management:** The `SidebarProvider` and `useSidebar` hook manage the expanded/collapsed/mobile states, driving conditional styling throughout the components.
-   **CSS Variables:** `--sidebar-width` (`16rem`) and `--sidebar-width-icon` (`4.5rem`) ensure consistent width management.

This documentation should help maintain clarity as the project evolves.
