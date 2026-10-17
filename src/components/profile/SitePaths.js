export default function SitePaths({ t }) {
  return (
    <div className="site-paths">
      <a href="#patient-advice">
        <span className="eyebrow">{t("FOR PATIENTS")}</span>
        <h2>{t("Practical information, easy to find.")}</h2>
        <p>{t("Browse notes by topic and save a link for later.")}</p>
        <span className="path-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <a href="#academic-profile">
        <span className="eyebrow">{t("ACADEMIC PROFILE")}</span>
        <h2>{t("Clinical experience & research.")}</h2>
        <p>
          {t(
            "Explore qualifications, publications, and scientific contributions.",
          )}
        </p>
        <span className="path-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    </div>
  );
}
