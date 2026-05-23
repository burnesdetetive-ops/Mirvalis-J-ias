const logoSrc = "/mirvalis-logo.jpeg";

export function Logo({ compact = false, watermark = false }) {
  if (watermark) {
    return (
      <img
        src={logoSrc}
        alt=""
        className="pointer-events-none h-[24vw] max-h-80 min-h-40 select-none object-contain opacity-[0.035]"
      />
    );
  }

  return (
    <img
      src={logoSrc}
      alt={compact ?"MIRVALIS" : "MIRVALIS Joias na Prata"}
      className={`shrink-0 object-contain ${compact ?"h-12 w-12 sm:h-14 sm:w-14" : "h-14 w-14 sm:h-16 sm:w-16"}`}
      draggable="false"
    />
  );
}
