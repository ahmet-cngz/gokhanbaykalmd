export default function SectionHeading({ number, eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <div className="section-number">{number}</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
