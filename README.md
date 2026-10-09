# Student Portfolio & Academic Management Website

**COS 106: Introduction to Web Technologies, Term Project (20 marks)**
**Student:** Zion Omogbeme Oshokhayame
**Programme:** BSc Computer Science, 200 Level, Miva Open University

- **Live site:** https://YOUR-GITHUB-USERNAME.github.io/cos106-portfolio/
- **Repository:** https://github.com/YOUR-GITHUB-USERNAME/cos106-portfolio

## About the project

A responsive personal website that presents my profile and projects, and includes an
interactive academic planner and a validated contact form. It is built with **plain HTML,
CSS and JavaScript only** (no frameworks, no build tools) and is hosted on GitHub Pages.

## Pages

| Page | File | What it contains |
|------|------|------------------|
| Home | `index.html` | Name, photo, welcome message, brief biography, quick facts, call-to-action buttons |
| About Me | `about.html` | Education timeline, career aspirations, skills table, hobbies, intro video |
| Projects | `projects.html` | Three project cards (image, description, tech tags, View Project / Source Code links) |
| Academic Planner | `planner.html` | JavaScript task manager: add / complete / delete / filter, saved in localStorage |
| Contact | `contact.html` | Contact form with JavaScript validation and a simulated send |

## File structure

```
index.html  about.html  projects.html  planner.html  contact.html
css/style.css      one external stylesheet for every page
js/main.js         shared: mobile menu, current-page highlight, footer year, scroll fade-in
js/planner.js      academic planner (task manager)
js/contact.js      contact form validation
images/            profile photo, project screenshots, video poster, favicon
```

## How the requirements are met

### HTML
- **Semantic elements** on every page: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.
- **Forms:** the task form (`planner.html`) and the contact form (`contact.html`, uses `novalidate`).
- **Table:** skills and proficiency table with `caption`, `thead`, `th scope` (`about.html`).
- **Images** with descriptive `alt` text on every page.
- **Lists:** `ul` (navigation, skills, facts) and `ol` (education timeline, planner instructions, reflection).
- **Multimedia:** HTML5 `<video>` with controls, poster and fallback message (`about.html`).
- **Same header, navigation and footer on every page**. The current page is highlighted by `js/main.js`.

### CSS (`css/style.css` only, with no inline styles)
- **Custom properties** in `:root` for the colour scheme, fonts, spacing and shadows.
- **Flexbox:** header, navigation, hero, buttons, task items, footer.
- **CSS Grid:** project cards, home/about cards, page layout with aside, task form.
- **Media queries:** mobile-first base, tablet (`min-width: 600px`), desktop (`min-width: 900px`), large (`min-width: 1200px`).
- **Hamburger menu** on mobile that animates into an "X".
- **Transitions:** hover effects on buttons, cards, links, images, chips and table rows.
- **Keyframe animations:** `fadeIn`, `slideUp`, `slideIn`, `float`, `growBar`.
- **Mobile-friendly:** no horizontal scrolling, 16px base font, tap targets of at least 44px. The table scrolls inside its own wrapper.
- **Accessibility:** skip link, visible focus outlines, `prefers-reduced-motion` support.

### JavaScript
- **Event handling:** `click`, `submit`, `input`, `change`, `blur`, `keydown`, `reset`, `resize`.
- **DOM manipulation:** `createElement`, `appendChild`, `classList`, `textContent`, `dataset`, `setAttribute`.
- **Arrays and functions:** tasks are stored in an array of objects and managed with `push`, `map`, `filter` and `forEach` inside named, commented functions (`addTask`, `toggleTask`, `deleteTask`, `renderTasks`, `updateCounter`, ...).
- **localStorage:** tasks persist after a page refresh.
- **Form validation:** no empty fields, regex email check, digits-only phone check, inline error messages, success message, form reset.

## Running locally

Open `index.html` in a browser, or run a small local server from the project folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Credits
- Fonts: [Google Fonts](https://fonts.google.com) (Poppins, Inter)
- Sample video: CC0 "flower" clip from [MDN Web Docs](https://developer.mozilla.org) (placeholder)
- Project images: SVG illustrations created for this project
# COS_106_Project
