# RentHub - Property Rental Platform

## Project Deliverables

* **Deployed Live Application:** https://renthub-app-46521.netlify.app/home
* **GitHub Repository:** https://github.com/U-B-O-T-S/renthub

---

## Test User Credentials

| Email | Password | Role |
| `demo@renthub.com` | `pass1234` | Registered Property Owner / User |


---

## Features Checklist

### Core Features
* **Auth Guards (`authGuard`):** Protects `/create-post`, `/edit-post/:id`, and `/profile`. Unauthenticated visitors are automatically routed to `/auth`.
* **Complete Routing Implementation:** Standalone routing setup with dynamic parameters (`/details/:id`, `/edit-post/:id`) and fallback redirects (`**` -> `/home`).
* **Reactive Form Validation:** Strict validations across building types, square feet (min 10), expected rent, title length (min 5), and descriptions with live error messaging.
* **State Management & Persistence:** Built using Angular Signals (`signal`, `computed`) integrated with `localStorage` for state persistence across reloads.
* **Responsive Layout:** Clean CSS Grid and Flexbox layouts aligned with modern rental application UI standards.

###  Bonus Features Attempted
1. **Edit Post Dual-Mode (`/edit-post/:id`):** Seamless workflow allowing users to update their posted properties with pre-filled form fields.
2. **Interactive Comments & Inquiries:** Real-time post commenting mechanism per listing.
3. **Interactive Multi-Photo Carousel:** Image preview gallery with next/previous controls and thumbnail view.
4. **Favorites / Bookmarking System:** Real-time property favoriting accessible from cards, detail pages, and the user profile.

---

##  Running Unit Tests

Execute the unit test suite (covering Service, Component, and Routing/Module logic):

```bash
npx ng test --watch=false --browsers=ChromeHeadless
