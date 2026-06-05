function SocialIcon ({ href, color, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-10 h-10 flex items-center justify-center rounded-full
        border border-gray-200 bg-white shadow-sm
        hover:scale-110 transition
      "
      style={{ color }}
    >
      {children}
    </a>
  )
}

export default SocialIcon 