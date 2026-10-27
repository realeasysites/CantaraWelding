PHOTOS — Cantara Welding & Fabrication
======================================
hero.jpg        Homepage background (exterior stair being set by lift)
race-car.jpg    Race Day section (sponsored stock car)
logo-orange.png Main logo (transparent background) — header, hero, footer
logo-white.png  White version of the logo (spare)
og-logo.png     1200x630 social-share preview (logo on black)
work/*.jpg      Job photos, named by category: railings-, stairs-,
                structural-, canopies-, equipment-

ADDING NEW PHOTOS
1. Resize to ~1600px wide, save as JPG, drop into /images/work/
2. Add an entry to public/js/gallery-data.js:
   { "img": "work/stairs-19.jpg", "cat": "stairs", "title": "Caption here", "featured": 0 }
   featured 1–12 = shows on the homepage in that order; 0 = gallery page only.
