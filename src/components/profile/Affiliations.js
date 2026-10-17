import SectionHeading from "../common/SectionHeading";
import { memberships, languages } from "../../data/profile";
export default function Affiliations({ t }) {
  return (
    <section id="affiliations" className="cv-section">
      <SectionHeading
        number="05"
        eyebrow={t("PROFESSIONAL COMMUNITY")}
        title={t("Affiliations & languages")}
      />
      <div className="affiliation-columns">
        <div>
          <h3 className="column-heading">{t("Society memberships")}</h3>
          {memberships.map(([name, detail]) => (
            <div className="membership" key={name}>
              <h4>{t(name)}</h4>
              <p>{t(detail)}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="column-heading">{t("Languages & assessments")}</h3>
          {languages.map(([name, detail, extra]) => (
            <div className="language" key={name}>
              <h4>{t(name)}</h4>
              <p>
                {t(detail)}
                {extra && (
                  <>
                    <br />
                    {t(extra)}
                  </>
                )}
              </p>
            </div>
          ))}
          <p className="assessment-note">
            {t(
              "Swedish, French, and German levels are based on Folkuniversitetet online test certificates.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
