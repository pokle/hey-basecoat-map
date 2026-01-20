# hey-basecoat-map

This is a sample response map app that uses:

- TypeScript
- Vite
- TailwindCSS
- Basecoat UI
- MapBox GL JS

# Prompts

I initiliased the project with:
```
npm create vite@latest hey-basecoat-map -- --template vanilla-ts
```

And then prompted Claude to:
```
/init This is a demonstrator that will use [tailwindcss](https://tailwindcss.com/) and [basecoat](https://basecoatui.com/) with plain vanilla typescript. The app displays
  a map using MapBox. It shows a list of waypoints from @public/corryong-cup-waypoints.csv that a user can select - which centers and zooms the map to that waypoint. The app
  is responsive. The waypoint list is shown on a list panel to the left of the screen. There's a header showing the name of the app. The rest of the screen is filled with
  the map. On a mobile phone screen, the header also shows a hamburger menu to the left. The sole purpose of the hamburger menu is to show/hide the waypoint list. Only on
  the mobile view, when the user taps on a waypoint, the waypoint list is hidden so as to not obscure the map. Oh, and the waypoint list floats over the map only in the
  mobile view.

  Important: Read all the documentation for all the libraries you use (tailwindcss, basecoat, etc...). Add any libraries you need (mapbox, a css parser, etc...).
```
