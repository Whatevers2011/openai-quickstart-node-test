import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React from "react";
import parse from "html-react-parser";
import Helmet from "react-helmet";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState("");
  const [buttonText, setButtonText] = useState("Generate gifts");

  async function onSubmit(event) {
    setButtonText("Generating...");
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animal: animalInput }),
    });
    const data = await response.json();

    let splitResult = data.result.split(",");
    let linkedResults = "";

    for (let index = 0; index < splitResult.length; index++) {
      const gift = splitResult[index];
      let substringToRemove = 0;
      let substringGift = "";
      
      //Sort the beginning
      if(gift.startsWith("An ")){
        linkedResults += gift.substring(0,3);
        substringToRemove = 3;
      }
      else if(gift.startsWith("A ")){
        linkedResults += gift.substring(0,2);
        substringToRemove = 2;
      }
      else if(gift.startsWith(" An ")){
        linkedResults += gift.substring(0,4);
        substringToRemove = 4;
      }
      else if(gift.startsWith(" A ")){
        linkedResults += gift.substring(0,3);
        substringToRemove = 3;
      }
      else if(gift.startsWith(" a ")){
        linkedResults += gift.substring(0,3);
        substringToRemove = 3;
      }
      else if(gift.startsWith(" an ")){
        linkedResults += gift.substring(0,4);
        substringToRemove = 4;
      }
      else if(gift.startsWith(" and a ")){
        linkedResults += gift.substring(0,7);
        substringToRemove = 7;
      }
      else if(gift.startsWith(" and an ")){
        linkedResults += gift.substring(0,8);
        substringToRemove = 8;
      }

      //Sort the link
      linkedResults += '<a target="_blank" href="https://www.amazon.com/gp/search?ie=UTF8&tag=aigiftfinder-20&linkCode=ur2&linkId=065bb6b5f906384b49a52a113938c35b&camp=1789&creative=9325&index=aps&keywords=';
      substringGift = gift.substring(substringToRemove, gift.length)
      linkedResults += substringGift.replace(/ /g, "+").replace('.', "");
      linkedResults += '">';
      linkedResults += gift.substring(substringToRemove, gift.length).replace('.', "");
      linkedResults += "</a>";

      //Sort the end
      if(index+1 != splitResult.length){
        linkedResults += ",";
      }
      else{
        linkedResults += ".";
      }
    }

    setResult(linkedResults);
    setButtonText("Generate gifts");
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>AI Gift Finder</title>
        <link rel="icon" href="/dog.png" />
        <meta name="description" content="Use the power of AI to find the perfect gift."/>
        <meta name="keywords" content="gift, ai, birthday, christmas, finder, present, valentines, day, graduation, new, baby, home, job, christening, amazon, gpt-3, openai, generator"/>
        <meta name="robots" content="index, follow"></meta>
        <meta property="og:title" content="AI Gift Finder" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Use the power of AI to find the perfect gift."/>
        <meta property="og:url" content="https://www.aigiftfinder.com" />
        <meta property="og:image" content="/ogimage.png" />
        <meta property="og:image:alt" content="A robot holding a gift" />
      </Helmet>

      <main className={styles.main}>
        <img src="/dog.png" alt="A robot holding a gift" className={styles.icon} />
        <h3>AI Gift Finder</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Who is the gift for? Describe them."
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value={buttonText} />
        </form>
        <div className={styles.result}>{parse(result)}</div>
        <div className={styles.credits}>AI Gift Finder is powered by <a href="https://openai.com/api/" target="_blank">OpenAI</a>. Created by <a href="https://louisemclennan.com/" target="_blank">Louise McLennan</a>. Affiliate links help keep the site running!</div>
      </main>
    </div>
  );
}
