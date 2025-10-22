# HCI Research Portfolio - Design Rules & Guidelines

## Overview
This document serves as the source of truth for building a professional HCI research web portfolio using vanilla HTML, CSS, and JavaScript. Based on modern academic portfolio design patterns, these rules ensure consistency, professionalism, and effective presentation of research work.

## Technical Specifications

### Core Technologies
- **HTML5**: Semantic markup for accessibility and SEO
- **CSS3**: Vanilla CSS with modern features (Grid, Flexbox, Custom Properties)
- **JavaScript**: Vanilla JS for interactions and dynamic content
- **No Frameworks**: Keep it simple and performant

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Mobile-first responsive design

## Layout Structure

### Grid System
- **Two-column layout**: Fixed sidebar (25-30%) + flexible main content (70-75%)
- **Sidebar width**: 280-320px on desktop
- **Content max-width**: 800-900px for optimal readability
- **Responsive breakpoints**: 
  - Mobile: < 768px (single column)
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Layout Hierarchy
```
├── Header/Sidebar (Fixed)
│   ├── Personal branding
│   ├── Navigation menu
│   ├── Contact information
│   └── Social links
└── Main Content (Scrollable)
    ├── Hero section
    ├── About/Bio
    ├── Research/Projects
    ├── Publications
    ├── Experience
    └── Footer
```

## Design Principles

### Visual Hierarchy
1. **Primary**: Name/Personal brand (largest, bold)
2. **Secondary**: Section headings (medium, structured)
3. **Tertiary**: Content text (readable, well-spaced)
4. **Quaternary**: Metadata, dates, labels (smaller, muted)

### Color Scheme
- **Primary colors**: Professional blues, grays, or neutral tones
- **Accent color**: One accent color for links and highlights
- **Text contrast**: Minimum 4.5:1 ratio for accessibility
- **Background**: Clean whites or subtle off-whites

### Typography
- **Font pairing**: Maximum 2 font families
- **Hierarchy**: Clear size progression (h1: 2.5rem, h2: 2rem, h3: 1.5rem, body: 1rem)
- **Line height**: 1.4-1.6 for headings, 1.6-1.8 for body text
- **Font weight**: Use weight variation for emphasis

## Content Organization Rules

### Sidebar Requirements
- **Personal name**: Prominently displayed at top
- **Professional title/tagline**: Brief descriptor
- **Navigation menu**: Clear, hierarchical
- **Contact information**: Email, institutional affiliation
- **Social/academic links**: LinkedIn, Google Scholar, ORCID

### Main Content Sections
1. **Hero/Introduction**: Brief bio with professional photo
2. **About**: Expanded background and expertise
3. **Research**: Current and past research projects
4. **Publications**: Academic papers and presentations
5. **Experience**: Academic and industry positions
6. **Teaching** (if applicable): Courses and educational activities

### Project Presentation
- **Project cards**: Consistent layout for each project
- **Required elements**: Title, description, technologies, links
- **Visual elements**: Screenshots, diagrams, or illustrations
- **Call-to-action**: Links to demos, papers, or repositories

## Navigation & UX Rules

### Navigation Patterns
- **Fixed sidebar**: Always visible on desktop
- **Smooth scrolling**: Between sections
- **Active state**: Highlight current section
- **Mobile menu**: Hamburger menu for mobile devices

### Interaction Design
- **Hover states**: Subtle feedback for interactive elements
- **Loading states**: For dynamic content
- **Error handling**: Graceful fallbacks
- **Progressive disclosure**: Show details on demand

## Responsive Design Rules

### Mobile-First Approach
- Design for mobile screens first
- Progressive enhancement for larger screens
- Touch-friendly interface elements (min 44px touch targets)

### Breakpoint Strategy
```css
/* Mobile: Default styles */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1200px) { }
```

### Mobile Adaptations
- **Sidebar**: Collapsible off-canvas menu
- **Images**: Optimized sizes and formats
- **Typography**: Adjusted scales for readability
- **Touch interactions**: Larger tap areas

## Performance Guidelines

### Loading Performance
- **Images**: Optimized formats (WebP with fallbacks)
- **Lazy loading**: For images and non-critical content
- **Minification**: CSS and JavaScript files
- **Caching**: Appropriate cache headers

### Code Quality
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **CSS organization**: Logical file structure and naming
- **JavaScript**: Progressive enhancement, no blocking scripts
- **Validation**: Valid HTML and CSS

## Accessibility Requirements

### Core Accessibility
- **Alt text**: Descriptive alternative text for images
- **Focus management**: Visible focus indicators
- **Keyboard navigation**: All functionality accessible via keyboard
- **Screen readers**: Proper ARIA labels and roles
- **Color contrast**: WCAG 2.1 AA compliance

### Semantic Markup
- Use appropriate HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- Proper heading hierarchy (h1-h6)
- Meaningful link text
- Form labels and descriptions

## Content Guidelines

### Professional Photography
- **High quality**: Professional headshots
- **Consistent style**: Matching tone and lighting
- **Appropriate sizing**: Optimized for web display
- **Alt text**: Descriptive text for screen readers

### Academic Content
- **Publications**: Proper academic citation format
- **Research descriptions**: Clear, accessible language
- **Technical details**: Balance detail with readability
- **Links**: Working links to papers, demos, and repositories

### Writing Style
- **Professional tone**: Academic but approachable
- **Concise descriptions**: Clear and to the point
- **Active voice**: Engaging and direct
- **Consistent formatting**: Standardized presentation

## File Structure

```
portfolio-hci/
├── index.html
├── css/
│   ├── styles.css
│   ├── responsive.css
│   └── print.css
├── js/
│   ├── main.js
│   └── navigation.js
├── images/
│   ├── profile/
│   ├── projects/
│   └── icons/
├── assets/
│   ├── documents/
│   └── media/
└── README.md
```

## Maintenance Rules

### Regular Updates
- **Content freshness**: Update projects and publications regularly
- **Link checking**: Verify all external links work
- **Performance monitoring**: Check loading times and metrics
- **Cross-browser testing**: Ensure compatibility

### Version Control
- Use Git for version control
- Meaningful commit messages
- Branch for major updates
- Tag releases for deployment

## Launch Checklist

### Pre-Launch
- [ ] All content proofread and fact-checked
- [ ] Images optimized and alt text added
- [ ] All links tested and functional
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] Performance optimization done

### SEO & Metadata
- [ ] Page titles and meta descriptions
- [ ] Open Graph tags for social sharing
- [ ] Structured data markup
- [ ] XML sitemap created
- [ ] Analytics tracking implemented

---

## Notes
- This document should be referenced for all design and development decisions
- Update this document as the portfolio evolves
- Share with any collaborators working on the portfolio
- Review quarterly for relevance and accuracy