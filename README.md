# UN Sustainability Goal 12 – Examples Explorer

A React web app for browsing and managing real-world examples of the UN Sustainable Development Goal 12: **Responsible Consumption and Production**.

The app loads the goal's 8 targets (12.1 – 12.8) and their examples from a JSON file. Users can search, filter, sort, add, edit and delete examples.

**Live demo:** https://ms-maryna.github.io/un-goal-12-explorer_react_project/

## Features

- **Search** by title, description or tags
- **Filter** by target, favourite, minimum rating and tag
- **Sort** the table by target, title or rating (ascending / descending)
- **Add, edit and delete** examples, with a confirmation step before deleting
- **Image gallery**: add or remove image links for each example
- **Tags manager**: add, rename and delete tags
- **Responsive layout**: a sortable table on desktop and cards on mobile
- **Details pop-up**: click an example to see all of its information

## Technologies

- React 16 (class components, state and props)
- JavaScript (ES6), HTML5
- SCSS / CSS, Bootstrap 5, Font Awesome, Animate.css
- JSON as the data source (loaded with `fetch`)

## How to run

The app loads its data with `fetch`, so open it through a local web server rather than by double-clicking the file.

1. Download or clone this repository
2. Start a local server in the project folder, for example:
   - VS Code: right-click `index.html` → **Open with Live Server**
   - or run `python -m http.server` and go to `http://localhost:8000`
3. Open `index.html` in the browser

## Project structure

    index.html                            main page
    js/app.js                             React components and app logic
    scss/main.scss                        styles (compiled to css/main.css)
    css/main.css                          compiled styles
    json/un_sustainability_goal_12.json   data: Goal 12 targets and examples

## Notes

- This project was made for the Full Stack Development module (Year 2) at Dundalk Institute of Technology (DkIT), using the course's starter template.
- Changes are saved in memory only, so they reset when the page is refreshed.
- Favourite and rating values are generated randomly when the data loads.

## Author

Maryna Hordiienko, BSc (Hons) Computing in Software Development, DkIT
