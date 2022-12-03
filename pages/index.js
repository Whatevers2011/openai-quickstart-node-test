import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animal: animalInput }),
    });
    const data = await response.json();
    setResult(data.result);
    // setAnimalInput("");
  }

  return (
    <div>
      <Head>
        <title>AI Gift Finder</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>AI Gift Finder</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Who is the gift for? Describe them."
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate gifts" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.credits}>AI Gift Finder is powered by <a href="https://openai.com/api/" target="_blank">OpenAI</a>. Created by <a href="https://louisemclennan.com/" target="_blank">Louise McLennan</a></div>
      </main>
    </div>
  );
}
