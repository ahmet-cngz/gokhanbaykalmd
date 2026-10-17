import Icon from "../common/Icon";
import doctorEmblem from "../../assets/doctor-emblem.svg";
import { sections } from "../../data/navigation";
export default function Sidebar({ t, active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div
          className="profile-avatar"
          role="img"
          aria-label={t("Doctor emblem")}
        >
          <img
            className="doctor-emblem"
            src={doctorEmblem}
            alt=""
            width="94"
            height="94"
            aria-hidden="true"
          />
        </div>
        <p className="sidebar-name">
          Rıza Gökhan Baykal<span>MD</span>
        </p>
        <p className="sidebar-specialty">
          {t("Endocrinology &")}
          <br />
          {t("Metabolic Diseases")}
        </p>
        <div className="location">
          <Icon name="pin" />
          Mardin, Türkiye
        </div>
        <nav aria-label={t("Profile sections")}>
          {sections.map(([id, label], index) => (
            <div className="sidebar-nav-item" key={id}>
              {index === 1 && (
                <p className="sidebar-group-label">{t("FOR PATIENTS")}</p>
              )}
              {index === 2 && (
                <a className="sidebar-group-label" href="#academic-profile">
                  {t("ACADEMIC PROFILE")}
                </a>
              )}
              <a
                href={`#${id}`}
                onClick={() => setActive(id)}
                className={active === id ? "active" : ""}
                aria-current={active === id ? "location" : undefined}
              >
                <span className="nav-index">
                  {index < 2
                    ? index === 0
                      ? "·"
                      : "+"
                    : String(index - 1).padStart(2, "0")}
                </span>
                {t(label)}
                <span className="nav-dot" />
              </a>
            </div>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="small-rule" />
          {t("CLINICAL PRACTICE.")}
          <br />
          {t("ACADEMIC INQUIRY.")}
        </div>
      </div>
    </aside>
  );
}
