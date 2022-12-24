import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React from "react";
import parse from "html-react-parser";
import { Analytics } from '@vercel/analytics/react';
import ReactGA from 'react-ga4';
import 'animate.css';

//Todo
//Figure out how to make it shareable
//A bigger input box

ReactGA.initialize('G-LBEEN8DRKQ');

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
        ReactGA.event("error", "Incorrect response");
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
          linkedResults += '<div class="animate__animated animate__fadeIn" style="margin-top: 24px; width: 320px; background-color: #492dd3; border-radius: 4px;width: 320px;"><div style="padding: 16px;"><p>Gifts for <b>' + animalInput + '</b>:</p>'
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
        // linkedResults += '<a target="_blank" href="https://www.amazon.com/gp/search?ie=UTF8&tag=aigiftfinder-20&linkCode=ur2&linkId=065bb6b5f906384b49a52a113938c35b&camp=1789&creative=9325&index=aps&keywords=';
        substringGift = gift.substring(substringToRemove, gift.length)
        // linkedResults += substringGift.replace(/ /g, "+").replace('.', "");
        // linkedResults += '">';
        linkedResults += gift.substring(substringToRemove, gift.length).replace('.', "");
        // linkedResults += "</a>";

        linkedResults += "</li>";

        //Sort the end
        if(index+1 == splitResult.length){
          linkedResults += '</ul></div></div>';
        }
      }

      setResult(linkedResults);
      setButtonText("Generate more gifts");

      console.log(linkedResults);

      // ReactGA.event({
      //   name: 'Gift query string',
      //   details: animalInput
      // });
      ReactGA.event("gift_query", animalInput);
    }
  }

  return (
    <div>
      <Head>
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
      </Head>

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
          <div className={styles.result} id="results">{parse(result)}</div>
      </main>
      <div className={styles.belowFold}>
        <div className={styles.belowFoldContent}>
          <h4>About AI Gift Finder</h4>
          <details>
          <summary>What is AI Gift Finder?</summary>
          <p><b>AI Gift Finder</b> uses <b>artificial intelligence</b> to help you find the perfect gift for any occasion. With its advanced algorithms, AI Gift Finder makes gift-giving easy and stress-free by suggesting <b>personalized gift ideas</b> that are tailored to the recipient's interests and preferences. No more wasting time scrolling through endless gift options - let AI Gift Finder do the work for you and find the perfect gift in no time!</p>
          </details>
          <details>
          <summary>How does AI Gift Finder work?</summary>
          <p>AI Gift Finder uses the <a href="https://openai.com/">OpenAI</a> API to power its gift-finding capabilities. The OpenAI API is a collection of tools and services that allow developers to integrate <b>advanced artificial intelligence capabilities</b> into their applications. AI Gift Finder uses the OpenAI API to analyze the recipient's interests and preferences and generate personalized gift suggestions based on that information. By leveraging the power of the OpenAI API, AI Gift Finder is able to provide users with personalized gift recommendations in a matter of seconds.</p>
          </details>
          <details>
          <summary>Can AI Gift Finder help me find unusual gifts?</summary>
          <p>AI Gift Finder can definitely help you find unusual gifts. With its advanced artificial intelligence algorithms, AI Gift Finder is able to analyze user inputs and generate personalized gift suggestions that are tailored to the recipient's interests and preferences. This means that AI Gift Finder can help you find gifts that are not only <b>unique and unusual</b>, but also <b>highly relevant and meaningful</b> to the recipient. Additionally, AI Gift Finder can save you time and effort by doing the work of sifting through countless gift options to find the perfect one. So whether you're looking for a truly unique and unusual gift, or just want to make gift-giving easy and stress-free, AI Gift Finder is a great tool to have on your side.</p>
          </details>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <p>AI Gift Finder - <a href="https://twitter.com/aigiftfinder">Twitter</a></p>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
