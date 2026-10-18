const SectionHeading = ({ number, eyebrow, title, children }) => {
  return (
    <div className='section-heading'>
      <div className='section-number'>{number}</div>
      <div>
        <p className='eyebrow'>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default SectionHeading;
