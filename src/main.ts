import './style.css'
import mapboxgl from 'mapbox-gl'
import { inferSchema, initParser } from 'udsv'

interface Waypoint {
  name: string
  latitude: number
  longitude: number
  description: string
  proximityDistance: number
  altitude: number
}

// Parse CSV data using uDSV
function parseCSV(csv: string): Waypoint[] {
  const schema = inferSchema(csv)
  const parser = initParser(schema)
  const rows = parser.typedObjs(csv) as Array<{
    Name: string
    Latitude: number
    Longitude: number
    Description: string
    'Proximity Distance': number
    Altitude: number
  }>

  const waypoints: Waypoint[] = rows.map(row => ({
    name: row.Name,
    latitude: row.Latitude,
    longitude: row.Longitude,
    description: row.Description,
    proximityDistance: row['Proximity Distance'],
    altitude: row.Altitude
  }))

  return waypoints.sort((a, b) => a.name.localeCompare(b.name))
}

// Toggle waypoint panel visibility
function togglePanel(show?: boolean): void {
  const panel = document.getElementById('waypoint-panel')
  if (!panel) return

  if (show === undefined) {
    panel.classList.toggle('-translate-x-full')
    panel.classList.toggle('translate-x-0')
  } else if (show) {
    panel.classList.remove('-translate-x-full')
    panel.classList.add('translate-x-0')
  } else {
    panel.classList.add('-translate-x-full')
    panel.classList.remove('translate-x-0')
  }
}

// Render waypoint list
function renderWaypoints(
  waypoints: Waypoint[],
  container: HTMLElement,
  onSelect: (waypoint: Waypoint) => void,
  selectedName?: string
): void {
  container.innerHTML = waypoints.map(wp => `
    <div
      class="waypoint-item ${wp.name === selectedName ? 'active' : ''}"
      data-waypoint="${wp.name}"
    >
      <div class="waypoint-name">${wp.name}</div>
      <div class="waypoint-desc">${wp.description}</div>
      <div class="waypoint-coords">
        ${wp.latitude.toFixed(4)}°, ${wp.longitude.toFixed(4)}° | ${wp.altitude}m
      </div>
    </div>
  `).join('')

  // Add click handlers
  container.querySelectorAll('.waypoint-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = item.getAttribute('data-waypoint')
      const waypoint = waypoints.find(wp => wp.name === name)
      if (waypoint) {
        onSelect(waypoint)
      }
    })
  })
}

// Main application
async function init(): Promise<void> {
  // Load waypoints from CSV
  const response = await fetch('/corryong-cup-waypoints.csv')
  const csvText = await response.text()
  const waypoints = parseCSV(csvText)

  // Get DOM elements
  const waypointList = document.getElementById('waypoint-list')!
  const searchInput = document.getElementById('waypoint-search') as HTMLInputElement
  const menuToggle = document.getElementById('menu-toggle')!

  // Initialize MapBox
  // Note: You need to set your MapBox access token
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN'

  // Calculate center from waypoints
  const avgLat = waypoints.reduce((sum, wp) => sum + wp.latitude, 0) / waypoints.length
  const avgLng = waypoints.reduce((sum, wp) => sum + wp.longitude, 0) / waypoints.length

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [avgLng, avgLat],
    zoom: 10
  })

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // Store markers for later reference
  const markers: Map<string, mapboxgl.Marker> = new Map()

  // Add markers for all waypoints once map loads
  map.on('load', () => {
    waypoints.forEach(wp => {
      const el = document.createElement('div')
      el.className = 'w-3 h-3 bg-primary rounded-full border-2 border-white shadow-md cursor-pointer'

      const marker = new mapboxgl.Marker(el)
        .setLngLat([wp.longitude, wp.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <div class="font-semibold">${wp.name}</div>
                <div class="text-sm">${wp.description}</div>
                <div class="text-xs text-gray-500 mt-1">Altitude: ${wp.altitude}m</div>
              </div>
            `)
        )
        .addTo(map)

      markers.set(wp.name, marker)

      // Click on marker selects waypoint
      el.addEventListener('click', () => {
        selectWaypoint(wp)
      })
    })
  })

  let selectedWaypoint: Waypoint | null = null

  // Handle waypoint selection
  function selectWaypoint(waypoint: Waypoint): void {
    selectedWaypoint = waypoint

    // Update list highlighting
    document.querySelectorAll('.waypoint-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-waypoint') === waypoint.name)
    })

    // Fly to waypoint
    map.flyTo({
      center: [waypoint.longitude, waypoint.latitude],
      zoom: 14,
      duration: 1500
    })

    // Open popup for selected marker
    const marker = markers.get(waypoint.name)
    if (marker) {
      marker.togglePopup()
    }

    // Hide the panel after selection
    togglePanel(false)
  }

  // Render initial waypoint list
  renderWaypoints(waypoints, waypointList, selectWaypoint)

  // Search functionality
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase()
    const filtered = waypoints.filter(wp =>
      wp.name.toLowerCase().includes(query) ||
      wp.description.toLowerCase().includes(query)
    )
    renderWaypoints(filtered, waypointList, selectWaypoint, selectedWaypoint?.name)
  })

  // Menu toggle (mobile)
  menuToggle.addEventListener('click', () => {
    togglePanel()
  })

  // Close panel when clicking on the map
  document.getElementById('map')!.addEventListener('click', () => {
    togglePanel(false)
  })
}

// Start the app
init().catch(console.error)
