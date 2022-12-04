import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React from "react";
import parse from "html-react-parser";
import Helmet from "react-helmet";
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState("");
  const [buttonText, setButtonText] = useState("Generate gifts");

  async function onSubmit(event) {
    setResult("");
    if(animalInput.trim() != ""){
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

        //Bullet points
        if(index == 0){
          linkedResults += '<h4>How about...</h4>'
          linkedResults += '<ul>';
        }

        linkedResults += '<li>';
        
        //Sort the beginning
        if(gift.startsWith("An ")){
          linkedResults += "An ";
          substringToRemove = 3;
        }
        else if(gift.startsWith("A ")){
          linkedResults += "A ";
          substringToRemove = 2;
        }
        else if(gift.startsWith(" An ")){
          linkedResults += "An ";
          substringToRemove = 4;
        }
        else if(gift.startsWith(" A ")){
          linkedResults += "A ";
          substringToRemove = 3;
        }
        else if(gift.startsWith(" a ")){
          linkedResults += "A ";
          substringToRemove = 3;
        }
        else if(gift.startsWith(" an ")){
          linkedResults += "An ";
          substringToRemove = 4;
        }
        else if(gift.startsWith(" and a ")){
          linkedResults += "A ";
          substringToRemove = 7;
        }
        else if(gift.startsWith(" and an ")){
          linkedResults += "An ";
          substringToRemove = 8;
        }

        //Sort the link
        linkedResults += '<a target="_blank" href="https://www.amazon.com/gp/search?ie=UTF8&tag=aigiftfinder-20&linkCode=ur2&linkId=065bb6b5f906384b49a52a113938c35b&camp=1789&creative=9325&index=aps&keywords=';
        substringGift = gift.substring(substringToRemove, gift.length)
        linkedResults += substringGift.replace(/ /g, "+").replace('.', "");
        linkedResults += '">';
        linkedResults += gift.substring(substringToRemove, gift.length).replace('.', "");
        linkedResults += "</a>";

        linkedResults += "</li>";

        //Sort the end
        if(index+1 == splitResult.length){
          linkedResults += '</ul>';
        }
      }

      setResult(linkedResults);
      setButtonText("Generate more gifts");
    }
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>AI Gift Finder</title>
        <link rel="icon" href="/gift.png" />
        <meta name="description" content="Use the power of AI to find the perfect gift."/>
        <meta name="keywords" content="gift, ai, birthday, christmas, finder, present, valentines, day, graduation, new, baby, home, job, christening, amazon, gpt-3, openai, generator"/>
        <meta name="robots" content="index, follow"></meta>
        <meta property="og:title" content="AI Gift Finder" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Use the power of AI to find the perfect gift."/>
        <meta property="og:url" content="https://www.aigiftfinder.com" />
        <meta property="og:image" content="https://www.aigiftfinder.com/ogimage.png" />
        <meta property="og:image:alt" content="A robot holding a gift" />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:title" content="AI Gift Finder" />
        <meta name="twitter:description" content="Use the power of AI to find the perfect gift." />
        <meta name="twitter:image" content="https://www.aigiftfinder.com/ogimage.png" />
        <meta name="twitter:image:alt" content="A robot holding a gift" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap" rel="stylesheet"></link>
      </Helmet>

      <main className={styles.main}>
          <img src="/robot.png" alt="A robot holding a gift" className={styles.icon} />
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
          </main>
          <footer className={styles.footer}>AI Gift Finder is powered by <a href="https://openai.com/api/" target="_blank">OpenAI</a>. Follow us on <a href="https://twitter.com/aigiftfinder" target="_blank">Twitter</a>. Affiliate links help keep the site running!</footer>
          <Analytics />
      </div>
  );
}
