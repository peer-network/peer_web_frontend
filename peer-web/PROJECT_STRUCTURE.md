# Vue App Project Structure

This document describes the folder structure for the Peer Network Vue.js frontend.

## Overview

```
src/
├── api/                    # 🔌 API Layer (GraphQL services)
├── assets/                 # 🎨 Static assets
│   ├── images/
│   ├── fonts/
│   ├── icons/peer-icons/
│   └── styles/             # SCSS stylesheets
├── components/
│   ├── base/               # 🎨 Design System (buttons, inputs, etc.)
│   ├── common/             # 🏠 App-wide (layout, widgets, modals)
│   └── features/           # 📦 Feature-specific components
├── composables/            # 🔄 Reusable Vue composition functions
├── helpers/                # 🛠️ Utility functions
├── layouts/                # 📐 Page layouts
├── pages/                  # 📄 Route views
├── plugins/                # 🔌 Vue plugins
├── router/                 # 🛣️  Vue Router configuration
└── stores/                 # 🗄️  Pinia state stores
```

---

## API Layer (`api/`)

| File | Purpose |
|------|---------|
| `client.js` | GraphQL/Axios setup |
| `auth.api.js` | Login, register, logout, forgot password |
| `posts.api.js` | CRUD posts, comments, likes, dislikes |
| `wallet.api.js` | Balance, transactions, send tokens |
| `profile.api.js` | Get/update profile, avatar, visibility |
| `settings.api.js` | User settings, preferences |
| `referral.api.js` | Referral stats, invite links |
| `ads.api.js` | Pinned posts, boost, ads history |
| `shop.api.js` | Products, orders, checkout |
| `user.api.js` | Search, follow/unfollow |
| `daily.api.js` | Daily free status |
| `tokenomics.api.js` | Token prices, liquidity |
| `upload.api.js` | Media upload |
| `report.api.js` | Report posts/users |

---

## Styles (`assets/styles/`)

```
styles/
├── abstracts/
│   ├── _variables.scss     # Colors, fonts, spacing, breakpoints
│   ├── _mixins.scss        # Responsive, flexbox, grid, animations
│   └── _functions.scss     # SCSS helper functions
├── base/
│   ├── _reset.scss         # CSS reset/normalize
│   ├── _typography.scss    # Font styles (md, xl, xxl, xxxl)
│   └── _utilities.scss     # Utility classes (none, bold, blur)
├── layout/
│   ├── _header.scss
│   ├── _sidebar.scss
│   ├── _footer.scss
│   └── _grid.scss
├── components/
│   ├── _buttons.scss
│   ├── _inputs.scss
│   ├── _modal.scss
│   ├── _cards.scss
│   └── _cropper.scss
├── pages/
│   ├── _auth.scss
│   ├── _dashboard.scss
│   ├── _posts.scss
│   ├── _wallet.scss
│   ├── _profile.scss
│   ├── _settings.scss
│   ├── _ads.scss
│   └── _shop.scss
└── main.scss               # Main entry (imports all)
```

---

## Components (`components/`)

### Base Components (`components/base/`)

Design system primitives reusable across the app.

| Folder | Components |
|--------|------------|
| `buttons/` | BaseButton, IconButton, FollowButton, FloatingActionButton |
| `inputs/` | BaseInput, BaseTextarea, BaseSelect, BaseCheckbox, BaseRadio, BaseSwitch, SearchInput |
| `feedback/` | BaseLoader, BaseToast, BaseAlert, BaseSkeleton, BaseProgress |
| `overlays/` | BaseModal, BaseDrawer, BasePopover, BaseDropdown |
| `display/` | BaseCard, BaseAvatar, BaseBadge, BaseTabs, BaseAccordion, BaseSlider |
| `media/` | BaseImageGallery, BaseVideoPlayer, BaseAudioPlayer, BaseMediaViewer |

### Common Components (`components/common/`)

| Folder | Purpose |
|--------|---------|
| `layout/` | AppHeader, AppFooter, AppSidebar, AppRightSidebar, AppNavigation |
| `widgets/` | WidgetProfile, WidgetMainMenu, WidgetFilters, WidgetDailyActions, etc. |
| `shared/` | UserCard, UserBadge, EmptyState, ErrorState, InfiniteScroll, TimeAgo |
| `modals/` | ShareModal, ReportModal, ConfirmModal, ProcessingModal |

### Feature Components (`components/features/`)

| Folder | Purpose |
|--------|---------|
| `auth/` | LoginForm, RegisterForm, ForgotPasswordForm, OnboardingModal |
| `dashboard/` | DashboardFeed, FeedFilters, SortOptions, PostTypeTabs |
| `posts/` | PostCard, PostDetail, PostActions, CreatePostForm, VideoTrimmer, etc. |
| `wallet/` | BalanceCard, TransactionList, SendTokensForm |
| `profile/` | ProfileHeader, ProfileStats, EditProfileForm, FollowersList |
| `settings/` | SettingsMenu, AccountSettings, ContentPreferences, ChangePassword |
| `referral/` | InviteCard, ReferralLink, ReferralStats, ReferralBoard |
| `ads/` | AdCard, AdsList, BoostPostFlow, AdsHistory |
| `shop/` | ProductCard, ProductList, ShopCheckoutModal |

---

## Composables (`composables/`)

Vue composition functions for reusable logic:

| File | Purpose |
|------|---------|
| `useAuth.js` | Auth state & methods |
| `useApi.js` | API wrapper with loading/error |
| `useToast.js` | Toast notifications |
| `useModal.js` | Modal control |
| `useValidation.js` | Form validation |
| `usePagination.js` | Pagination logic |
| `useInfiniteScroll.js` | Infinite scroll |
| `useDebounce.js` | Debounce utility |
| `useLocalStorage.js` | LocalStorage reactive |
| `useCookies.js` | Cookie management |
| `useMediaQuery.js` | Responsive breakpoints |
| `useClipboard.js` | Copy to clipboard |
| `useTimeAgo.js` | Relative time formatting |
| `useDailyFree.js` | Daily free actions |
| `useTokenomics.js` | Token prices |
| `useMediaUpload.js` | File upload handling |
| `useZoom.js` | Viewport scaling |

---

## Stores (`stores/`)

Pinia state management stores:

| Store | Purpose |
|-------|---------|
| `auth.store.js` | Auth state, login, logout |
| `user.store.js` | Current user data, preferences |
| `posts.store.js` | Posts state, pagination |
| `wallet.store.js` | Wallet balance, transactions |
| `profile.store.js` | Profile data |
| `settings.store.js` | Settings state |
| `referral.store.js` | Referral data |
| `ads.store.js` | Ads state |
| `shop.store.js` | Shop products, cart |
| `daily.store.js` | Daily free actions |
| `tokenomics.store.js` | Token prices, liquidity |
| `app.store.js` | Global: theme, loading, online status |

---

## Pages (`pages/`)

Route views organized by feature:

| Folder | Pages |
|--------|-------|
| `auth/` | LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage |
| `dashboard/` | DashboardPage |
| `posts/` | PostDetailPage, CreatePostPage, GuestPostPage |
| `wallet/` | WalletPage |
| `profile/` | MyProfilePage, ViewProfilePage, EditProfilePage |
| `settings/` | SettingsPage |
| `referral/` | InvitePage, ReferralBoardPage |
| `ads/` | MyAdsPage |
| `shop/` | ShopPage |
| `misc/` | VersionHistoryPage |

Plus: `LandingPage.vue`, `NotFoundPage.vue`

---

## Router (`router/`)

```
router/
├── index.js                # Router instance
├── guards.js               # Navigation guards (auth check)
└── routes/
    ├── auth.routes.js
    ├── dashboard.routes.js
    ├── posts.routes.js
    ├── wallet.routes.js
    ├── profile.routes.js
    ├── settings.routes.js
    ├── referral.routes.js
    ├── ads.routes.js
    ├── shop.routes.js
    └── index.js            # Combine all routes
```

---

## Layouts (`layouts/`)

| Layout | Usage |
|--------|-------|
| `AuthLayout.vue` | Login, Register (no sidebar) |
| `MainLayout.vue` | Dashboard, Profile (with sidebars) |
| `SettingsLayout.vue` | Settings pages (with menu) |
| `EmptyLayout.vue` | Minimal layout (guest view) |
