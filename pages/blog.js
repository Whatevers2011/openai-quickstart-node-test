// pages/index.js

import { PrismicText, PrismicRichText } from '@prismicio/react'
import { createClient } from '../prismicio'

export async function getStaticProps() {
    // Client used to fetch CMS content.
    const client = createClient()
  
    // Page document for our homepage from the CMS.
    const page = await client.getByUID('page', 'test')
  
    // Pass the homepage as prop to our page.
    return {
      props: { page },
    }
}

  // Add the `page` prop in the Home component.
export default function Home({ page }) {
    // Contents of the component...
    return(
        <main>
            <h1>
                <PrismicText field={page.data.greeting} />
            </h1>
            <div>
                <PrismicRichText field={page.data.description} />
            </div>
        </main>
    );
}