# HomeBoo 3D

[![Buy me a coffee via PayPal](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-00457C?logo=paypal&logoColor=white)](https://paypal.me/sebagueven)

Your home as an interactive 3D model in Home Assistant. Tap a room, the camera flies in, and the room's devices appear right next to it. Lights glow inside the model, covers move, the TV shows what is playing and the front door shows whether it is locked.

Draw your own floor plan directly in Home Assistant with drag & drop – no Blender, no Sweet Home 3D, no external files.

![HomeBoo 3D](docs/screenshot.png)

## Features

- **3D view of your home** with smooth camera flights into each room, room labels and a room bar
- **Live device states**: lights (brightness and colour), covers, locks, media players, climate, switches and fans
- **Tap things in the model** – floor lamps, ceiling lights, spots, the TV, the fireplace and covers switch when you tap them; long-press or right-click opens the full controls right next to the device, with **undo** after every switch
- **On right now** – the overview lists everything that is on, with one button for **all lights off**, plus all open windows and doors
- **Temperature view** – colours every room by its temperature
- **Control panel per room** – devices come from the floor plan and from the linked Home Assistant **area**
- **Choose what each room shows** – hide single devices of an area with one click (or hide all and pick the few you want), add devices from other areas and drag them into your own order
- **Your own pictures** – upload a photo of your lamp (or any device) and it replaces the icon on the card
- **Window and door contacts** – open windows glow orange, doors swing open and closed in the model
- **Motion and presence** – rooms pulse softly while a motion or presence sensor is on
- **Floor plan editor** built into the card configuration: draw rooms, drag walls and corners, drop doors, windows, furniture and lights
- **16 floors and interior wall colours per room** – oak, walnut, herringbone, marble, concrete, tiles, carpet and more
- **Over 40 pieces of furniture** – including corner sofa, fireplace, piano, kitchen island, crib, parasol and barbecue
- Walls are generated automatically from the room outlines, including open transitions between rooms
- Trace an image of your floor plan and set the scale with a known distance
- Day and night follow `sun.sun`, scenes are available from the overview
- German and English

## Installation

### HACS (custom repository)

1. Open **HACS** → three-dot menu → **Custom repositories**
2. Add `https://github.com/AbuTvboo/homeboo-3d-card` with type **Dashboard**
3. Search for **HomeBoo 3D** and install it
4. Reload the browser

### Manual

1. Copy `dist/homeboo-3d-card.js` to `/config/www/homeboo-3d-card.js`
2. Add it as a resource: **Settings → Dashboards → ⋮ → Resources** → `/local/homeboo-3d-card.js`, type **JavaScript module**

## Getting started

1. Edit a dashboard and add the card **HomeBoo 3D** (a sample apartment is pre-loaded)
2. Click **Open floor plan editor**
3. Load the sample or start with an empty plan, then draw your rooms
4. Select a room and pick its **Home Assistant area** – all lights, covers, switches and sensors of that area appear in the room
5. Under **Devices in this room** use the eye to hide what you don't want on the card, or add devices from other areas
6. Optionally place lights where they really are and link them to an entity, so they glow at the right spot
7. Select a window or door and set its **contact sensor** to see it open in the model
8. Click **Apply**, then **Save**

For a full-screen view, use a view of type **Panel** and set the height to **Screen height**.

## Configuration

Everything can be set in the visual editor. YAML options:

| Option | Default | Description |
| --- | --- | --- |
| `title` | plan name | Title shown in the top left |
| `height` | `600px` | Card height, any CSS length or `full` |
| `night` | `auto` | `auto` (follows `sun.sun`), `day` or `night` |
| `accent` | `#7ef0ff` | Accent colour |
| `tap_action` | `toggle` | `toggle` switches lights, TV, fireplace and covers on tap, `details` always opens the controls |
| `panel` | `open` | `collapsed` starts with the side panel folded in, handy for wall tablets |
| `three_url` | jsDelivr CDN | URL of `three.module.js`, for running without internet |
| `plan` | – | The floor plan, written by the editor |

### Running without internet

The 3D engine [three.js](https://threejs.org) is loaded from jsDelivr by default. To keep everything local, download `three.module.js` (version 0.170.0) to `/config/www/homeboo/three.module.js` and set:

```yaml
three_url: /local/homeboo/three.module.js
```

## Floor plan editor

| Action | How |
| --- | --- |
| Draw a room | Tool **Room** and drag a rectangle, or **Free shape** and click the corners |
| Change the shape | Drag corners or the handle in the middle of a wall; **+** adds a corner |
| Open transition | Room properties → set the wall to **Open** |
| Doors, windows, furniture, lights | Drag them from the left bar onto the plan |
| Rotate furniture | Rotation handle or `Q` |
| Undo / redo | `Ctrl+Z` / `Ctrl+Y` |
| Free dragging without snapping | Hold `Shift` |
| Pan | Drag an empty spot or hold `Space` |

The plan is stored in the card configuration and is included in Home Assistant backups. A traced background image stays in your browser only.

## Changelog

### 0.3.1
- Support link (PayPal) in the README and the card editor

### 0.3.0
- Tap devices and furniture in the 3D model to switch them, long-press or right-click for full controls, undo after every switch
- Locks, PCs and appliances never switch on a single tap – they always open the controls first
- Overview: “On right now” with “All lights off”, list of open windows and doors, clickable tiles
- Temperature view with colour scale
- “All lights in this room” button, media controls (play/pause, skip, volume)
- Editor: reorder devices per room by drag & drop, “Show all” and “Hide all”
- Your own pictures for devices (for example a photo of your lamp) instead of the standard icons
- New card options: tap behaviour and collapsed side panel

### 0.2.0
- Show or hide single devices per room, add devices from other areas
- Window and door contact sensors with 3D effects, motion and presence highlighting
- 16 floor types, interior wall colours per room
- 15 new pieces of furniture, spotlights and motion sensors in the editor
- Extra sensor values (for example CO₂ or power) show up as chips in the room

### 0.1.1
- Fixed the card staying empty, overview now fills the available space

## Roadmap

- Multiple floors
- Bundled build without CDN

## Support

HomeBoo 3D is free and made in my spare time. If it makes your home a bit nicer, you can buy me a coffee:

[![Buy me a coffee via PayPal](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-00457C?logo=paypal&logoColor=white)](https://paypal.me/sebagueven)

Bug reports and ideas are just as welcome – open an issue on GitHub.

## License

MIT

---

## Deutsch – Kurzanleitung

**HomeBoo 3D** zeigt deine Wohnung als 3D-Modell in Home Assistant. Raum antippen, die Kamera fliegt hinein, und die Geräte des Raums erscheinen daneben.

1. In HACS unter **Benutzerdefinierte Repositories** diese Adresse mit Typ **Dashboard** hinzufügen und installieren
2. Dashboard bearbeiten, Karte **HomeBoo 3D** hinzufügen
3. **Grundriss-Editor öffnen**, Räume zeichnen, jedem Raum einen **Bereich** aus Home Assistant zuordnen
4. Unter **Geräte in diesem Raum** mit dem Auge ausblenden, was nicht in der Karte erscheinen soll (oder **Alle ausblenden** und nur die gewünschten wieder einblenden)
5. **Übernehmen** und **Speichern**

Gefällt dir die Karte? Über [PayPal](https://paypal.me/sebagueven) kannst du mir einen Kaffee spendieren ☕ – danke!
