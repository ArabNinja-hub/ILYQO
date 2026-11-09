import { Link } from "react-router-dom";

/**
 * Public URL of the official ILYQO logo. The file is the exact asset supplied
 * in the repository (JPEG, 1080×720, solid black background) — it is served
 * unmodified from /public/brand.
 */
export const LOGO_SRC = `${import.meta.env.BASE_URL}brand/ilyqo-logo.jpg`;

/**
 * Measured bounds of the artwork inside the 1080×720 canvas:
 * x 93–987, y 163–526 → 894×363 px (≈ 2.46:1), centred horizontally with its
 * vertical centre at ~47.8% of the canvas height. These numbers only drive the
 * CSS crop below; the image itself is never altered.
 */
const ARTWORK_ASPECT = "894 / 363";
const ARTWORK_POSITION = "50% 44.5%";

const sizes = {
  sm: "h-9",
  md: "h-11",
  lg: "h-14",
  xl: "h-20",
} as const;

type LogoProps = {
  size?: keyof typeof sizes;
  className?: string;
  /** Extra classes for the wrapping link (positioning, blend mode). */
  linkClassName?: string;
  /** Route to navigate to when the logo is clicked. Pass `null` for a static logo. */
  to?: string | null;
  label?: string;
  priority?: boolean;
};

/**
 * Official ILYQO logo.
 *
 * The supplied asset has no alpha channel (JPEG on black). To show it faithfully
 * on the midnight-navy surfaces without redrawing it:
 *  - `mix-blend-screen` lets the black canvas fall away against the dark
 *    backdrop while leaving the white wordmark and the brand violet unchanged
 *    (screen-blending onto near-black shifts colours by < 6/255).
 *  - `object-cover` inside a wrapper with the artwork's own aspect ratio crops
 *    only the empty black margin. Scaling stays uniform, so proportions are
 *    preserved exactly.
 *
 * Render it on an opaque dark surface (ink-950/ink-900), OR — when it must sit
 * on a translucent surface such as the glass navbar — make the link itself a
 * fixed element with `mix-blend-screen` and no stacking-context ancestors, so
 * the blend is computed against the real page rather than an isolated group
 * (inside an isolated group the black canvas would come out opaque).
 */
export function Logo({
  size = "md",
  className = "",
  linkClassName = "",
  to = "/",
  label = "ILYQO — home",
  priority = false,
}: LogoProps) {
  const image = (
    <span
      className={`relative block overflow-hidden ${sizes[size]} ${className}`}
      style={{ aspectRatio: ARTWORK_ASPECT }}
    >
      <img
        src={LOGO_SRC}
        alt="ILYQO"
        width={1080}
        height={720}
        draggable={false}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full select-none object-cover mix-blend-screen"
        style={{ objectPosition: ARTWORK_POSITION }}
      />
    </span>
  );

  if (to === null) return image;

  return (
    <Link
      to={to}
      aria-label={label}
      className={`inline-flex shrink-0 items-center rounded-md ${linkClassName}`}
    >
      {image}
    </Link>
  );
}
