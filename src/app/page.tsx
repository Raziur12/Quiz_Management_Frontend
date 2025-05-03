import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* <h1>Welcome to Quiz Management System</h1> */}
      <h1 className={styles.title} style={{margin:"auto", justifyContent:"center"}}>Next.js Quiz Management</h1>
    </div>
  );
}
