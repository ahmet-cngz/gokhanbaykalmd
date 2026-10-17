import Icon from 'components/common/Icon';
import SectionHeading from 'components/common/SectionHeading';
import cvData from 'data/cv.json';

const { presentations } = cvData;
const Presentations = ({ t }) => {
  return (
    <section id='presentations' className='cv-section'>
      <SectionHeading
        number='03'
        eyebrow={t('SCIENTIFIC EXCHANGE')}
        title={t('Conference presentations')}
      >
        <span className='section-count'>{t('29 presentations')}</span>
      </SectionHeading>
      <p className='section-intro'>
        {t(
          'Contributions to European and national endocrinology congresses, including ECE, the Joint Congress of ESPE and ESE, EndoBridge, and TEMD.',
        )}
      </p>
      <div className='presentation-groups'>
        {presentations.map((group) => (
          <details key={group.title} className='presentation-group'>
            <summary>
              <span>{t(group.title)}</span>
              <span className='presentation-total'>
                {String(group.items.length).padStart(2, '0')}
                <Icon name='chevron' />
              </span>
            </summary>
            <ol>
              {group.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    '--item-delay': `${Math.min(i * 45, 450)}ms`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </section>
  );
};

export default Presentations;
