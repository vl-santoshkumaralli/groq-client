const  {createClient} = require('next-sanity');


async function fetchSites() {
  const client = createClient({
    projectId: '{{PROJECT_ID}}',
    token: '{{TOKEN}}',
    dataset: '{{DATASET}}',
    apiVersion: '2023-08-01', // use current date
    useCdn: false,
  });
  
  const query = `
    *[
      (defined(themeSettings.siteColors) && length(themeSettings.siteColors) > 0) ||
      (defined(themeSettings.checkoutColors) && length(themeSettings.checkoutColors) > 0) || 
      (
        defined(themeSettings.commonTheme) &&
        defined(themeSettings.commonTheme->colors) && 
        length(themeSettings.commonTheme->colors) > 0
      )
    ] {
      _id,
      _type,
      title,
      domain,
      themeSettings {
        commonTheme-> {
          _id,
          colors
        },
        siteColors,
        checkoutColors
      }
    } | order(_id asc)
  `;
  const results = await client.fetch(query);
  const deduplicatedData = Array.from(
    new Map((results ?? []).map(item => [item._id, item])).values()
  );
  console.log('***** Total matched records *****:', (deduplicatedData ?? []).length, (deduplicatedData ?? []).map(result => result.domain ?? result.title ));
  // console.log(deduplicatedData);
}
fetchSites();
