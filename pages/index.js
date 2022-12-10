import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React from "react";
import parse from "html-react-parser";
import Helmet from "react-helmet";
import { Analytics } from '@vercel/analytics/react';

//Todo
//Add basic SEO text
//Fix the headers so ogdata works
//Figure out how to make it shareable
//A bigger input box
//Make it look better
//Link to amazon uk for uk users

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState("");
  const [buttonText, setButtonText] = useState("Generate gifts");

  async function onSubmit(event) {
    setResult("");
    if(animalInput.trim() != ""){
      setButtonText("Generating...");
      event.preventDefault();
      const response = await fetch("/api/generate", { ///api/generate
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      // const data;
      let data;
      try {
        data = await response.json();
      } catch (error) {
        setResult("Error: The AI took too long to create your list of gifts. Please try again.");
        setButtonText("Generate gifts");
        return
      }
      
      console.log(data.result)

      let trimResult = data.result.trim();
      let splitResult = trimResult.split(",");
      let linkedResults = "";

      for (let index = 0; index < splitResult.length; index++) {
        const gift = splitResult[index];
        let substringToRemove = 0;
        let substringGift = "";

        //Bullet points
        if(index == 0){
          linkedResults += '<div style="padding: 16px;"><p>Gifts for <b>' + animalInput + '</b>:</p>'
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
          linkedResults += '</ul></div>';
        }
      }

      setResult(linkedResults);
      setButtonText("Generate more gifts");
    }
  }

  return (
    <div>
      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LBEEN8DRKQ"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-LBEEN8DRKQ');
        </script>
        <meta charSet="utf-8" />
        <title>AI Gift Finder</title>
        <link rel="icon" href="/favicon.png" />
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
        <style>{"body { background-color: #5333ED; }"}</style>
      </Helmet>

      <main className={styles.main}>
          <img src="/VectorRobot.png" alt="A smiling robot face" className={styles.icon} />
          <h3>AI Gift Finder</h3>
          <p>Start by describing who the gift is for</p>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="animal"
              placeholder="A woman who likes nature, history and learning"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <input type="submit" value={buttonText} />
          </form>
          <div className={styles.result}>{parse(result)}</div>
          </main>
          <Analytics />
      </div>
  );
}
