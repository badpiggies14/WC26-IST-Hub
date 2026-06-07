export default function StadiumBackground({ children, className = '', ...props }) {
  return (
    <section className={`stadium-bg ${className}`} {...props}>
      {children}
    </section>
  )
}
