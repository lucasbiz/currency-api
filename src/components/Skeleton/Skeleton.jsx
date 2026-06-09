import styles from "./Skeleton.module.css";

function Skeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.bone} ${styles.code}`} />
        <div className={`${styles.bone} ${styles.fav}`} />
      </div>
      <div className={`${styles.bone} ${styles.name}`} />
      <div className={`${styles.bone} ${styles.bid}`} />
      <div className={styles.meta}>
        <div className={`${styles.bone} ${styles.metaItem}`} />
        <div className={`${styles.bone} ${styles.metaItem}`} />
        <div className={`${styles.bone} ${styles.metaItem}`} />
        <div className={`${styles.bone} ${styles.metaItem}`} />
      </div>
      <div className={`${styles.bone} ${styles.variation}`} />
    </div>
  );
}

function SkeletonGrid({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  );
}

export default SkeletonGrid;
