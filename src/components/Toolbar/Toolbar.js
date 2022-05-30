import styles from "./Toolbar.module.css";

const Toolbar = () => {
  return (
    <div
      className={styles.container}
      onContextMenu={(e) => e.preventDefault()}
    ></div>
  );
};

export default Toolbar;
