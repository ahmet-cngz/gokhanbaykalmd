import SectionHeading from "../common/SectionHeading";
import Icon from "../common/Icon";
import { courses } from "../../data/profile";
export default function ProfessionalDevelopment({ t }) {
  return (
    <section id="development" className="cv-section">
      <SectionHeading
        number="04"
        eyebrow={t("CONTINUING EDUCATION")}
        title={t("Professional development")}
      />
      <div className="course-groups">
        {courses.map(([title, items]) => (
          <article className="course-group" key={title}>
            <h3>{t(title)}</h3>
            {title === "Endocrinology" && (
              <p className="muted course-provider">
                {t("Endocrine Society · Non-board education")}
              </p>
            )}
            <ul>
              {items.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <a
        className="project-link"
        href="https://github.com/gokhanbaykal89-a11y/gokhan_endocrinology_stat_project"
        target="_blank"
        rel="noreferrer"
      >
        <div>
          <span className="eyebrow">{t("SELECTED PYTHON PROJECT")}</span>
          <h3>{t("Endocrine time-series analysis")}</h3>
          <p>
            {t(
              "A reproducible workflow for feature extraction and visualization using synthetic, wearable-style signals.",
            )}
          </p>
        </div>
        <Icon name="arrow" />
      </a>
      <div className="peer-review">
        <span className="eyebrow">{t("ACADEMIC SERVICE")}</span>
        <p>
          {t("Peer-review contributions:")} <strong>{t("8 reviews")}</strong>{" "}
          {t(
            "across 4 publications/grants, as reported in the CV’s ORCID record.",
          )}
        </p>
      </div>
    </section>
  );
}
