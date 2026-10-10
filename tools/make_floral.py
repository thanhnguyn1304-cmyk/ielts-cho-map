"""Generate assets/floral.svg: a seamless tile of bold flowers, leaves and sparkles
(pink base, purple/blue/coral petals, green leaves, grain) used as the site background."""
import math, random, os

random.seed(7)
W = H = 720
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = []

GRADS = {
    "pb": ("#8a3fd1", "#2f7be8"),   # purple -> blue petals
    "cr": ("#ff6a3d", "#e8323c"),   # coral -> red
    "pp": ("#c04fd8", "#6c3bc9"),   # magenta -> violet
    "lf": ("#3fb36b", "#1d6b4a"),   # leaf greens
    "bl": ("#3d8bff", "#2350c8"),   # cobalt
    "pk": ("#ff9ec9", "#f0559c"),   # pink petal
}


def wrap(x, y, r, draw):
    """draw at (x, y) plus copies across edges so the tile repeats seamlessly"""
    for dx in (-W, 0, W):
        for dy in (-H, 0, H):
            if -r < x + dx < W + r and -r < y + dy < H + r:
                draw(x + dx, y + dy)


def leaf(x, y, ang, size, g="lf"):
    def d(x, y):
        out.append(f'<g transform="translate({x:.1f} {y:.1f}) rotate({ang:.1f})">'
                   f'<path d="M0 0 C {size*0.35:.1f} {-size*0.32:.1f} {size*0.8:.1f} {-size*0.18:.1f} {size:.1f} 0 '
                   f'C {size*0.8:.1f} {size*0.18:.1f} {size*0.35:.1f} {size*0.32:.1f} 0 0Z" fill="url(#{g})"/>'
                   f'<path d="M{size*0.08:.1f} 0 L{size*0.9:.1f} 0" stroke="#bff0c9" stroke-width="2" opacity=".55"/></g>')
    wrap(x, y, size, d)


def flower(x, y, r, petals, g, center="#ffb2c8", rot=0):
    def d(x, y):
        s = [f'<g transform="translate({x:.1f} {y:.1f}) rotate({rot:.1f})">']
        for i in range(petals):
            a = 360 / petals * i
            s.append(f'<ellipse cx="{r*0.55:.1f}" cy="0" rx="{r*0.55:.1f}" ry="{r*0.2:.1f}" fill="url(#{g})" transform="rotate({a:.1f})"/>')
            s.append(f'<path d="M{r*0.18:.1f} 0 L{r*0.9:.1f} 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" transform="rotate({a:.1f})"/>')
        s.append(f'<circle r="{r*0.2:.1f}" fill="{center}"/>')
        for k in range(5):
            aa = random.random() * math.tau
            s.append(f'<circle cx="{math.cos(aa)*r*0.1:.1f}" cy="{math.sin(aa)*r*0.1:.1f}" r="{max(1.5, r*0.025):.1f}" fill="#d63a6b"/>')
        s.append("</g>")
        out.append("".join(s))
    wrap(x, y, r, d)


def bloom(x, y, r, rot):
    """big layered cabbage-rose style bloom"""
    def d(x, y):
        s = [f'<g transform="translate({x:.1f} {y:.1f}) rotate({rot:.1f})">']
        for layer, (g, k) in enumerate((("pp", 1.0), ("cr", 0.78), ("pb", 0.56), ("cr", 0.36))):
            n = 7 - layer
            for i in range(n):
                a = 360 / n * i + layer * 17
                s.append(f'<path d="M0 0 C {r*k*0.3:.1f} {-r*k*0.55:.1f} {r*k*0.95:.1f} {-r*k*0.5:.1f} {r*k:.1f} 0 '
                         f'C {r*k*0.95:.1f} {r*k*0.5:.1f} {r*k*0.3:.1f} {r*k*0.55:.1f} 0 0Z" fill="url(#{g})" transform="rotate({a:.1f})"/>')
        s.append("</g>")
        out.append("".join(s))
    wrap(x, y, r, d)


def tiny(x, y, r):
    def d(x, y):
        s = [f'<g transform="translate({x:.1f} {y:.1f})">']
        for i in range(5):
            s.append(f'<circle cx="{r*0.55:.1f}" cy="0" r="{r*0.45:.1f}" fill="#ef3b2d" transform="rotate({72*i})"/>')
        s.append(f'<circle r="{r*0.3:.1f}" fill="#ffd166"/></g>')
        out.append("".join(s))
    wrap(x, y, r, d)


def sparkle(x, y, L):
    def d(x, y):
        out.append(f'<g stroke="#fff" stroke-linecap="round" opacity=".85"><path d="M{x-L:.1f} {y-L*0.6:.1f} L{x+L:.1f} {y+L*0.6:.1f}" stroke-width="2"/>'
                   f'<path d="M{x-L*0.6:.1f} {y+L:.1f} L{x+L*0.6:.1f} {y-L:.1f}" stroke-width="2"/></g>'
                   f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#fff"/>')
    wrap(x, y, L, d)


# leaves first (under the flowers)
for _ in range(46):
    leaf(random.uniform(0, W), random.uniform(0, H), random.uniform(0, 360), random.uniform(80, 150), random.choice(["lf", "lf", "bl"]))
blooms = [(170, 190), (520, 470), (560, 110), (150, 590), (380, 330), (690, 640)]
for (x, y) in blooms:
    bloom(x, y, random.uniform(95, 120), random.uniform(0, 360))
for (x, y, g) in [(300, 110, "pb"), (330, 620, "pp"), (650, 300, "pb"), (40, 380, "pk"), (420, 40, "pk"),
                  (250, 450, "pb"), (520, 650, "pk"), (700, 470, "pp")]:
    flower(x, y, random.uniform(70, 95), random.choice([6, 7, 8]), g, rot=random.uniform(0, 60))
for _ in range(12):
    tiny(random.uniform(0, W), random.uniform(0, H), random.uniform(9, 14))
for _ in range(7):
    sparkle(random.uniform(0, W), random.uniform(0, H), random.uniform(18, 34))

defs = "".join(f'<linearGradient id="{k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>'
               for k, (a, b) in GRADS.items())
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
       f'<defs>{defs}<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>'
       f'<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .3 0"/></filter></defs>'
       f'<rect width="{W}" height="{H}" fill="#ff86c4"/>' + "".join(out) +
       f'<rect width="{W}" height="{H}" filter="url(#grain)"/></svg>')
open(os.path.join(ROOT, "assets", "floral.svg"), "w", encoding="utf-8").write(svg)
print("bytes", len(svg))
